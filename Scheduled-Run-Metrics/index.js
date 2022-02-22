require('../config/db/database');
const { sub, add } = require('date-fns');
const { BlobServiceClient } = require('@azure/storage-blob');
const {
    getMetricCost,
    getRawCost,
    getAllResources,
    getACU,
    getTotalACU,
} = require('../metrics/azure');
const config = require('../config/config');
const cost = require('../config/db/metrics/cost');
const acu = require('../config/db/metrics/acu');

module.exports = async (context, myTimer) => {
    // Prepare start and end dates
    const endDate = new Date();
    let startDate = sub(endDate, { days: config.DAYS_BACK });
    startDate = add(startDate, { seconds: 1 });

    // log timer info
    if (myTimer.isPastDue) {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', endDate.toISOString());

    // Get GiB of IATI Data (denominator)
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        config.AZURE_BLOB_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(config.AZURE_BLOB_IATI_CONTAINER);
    let iatiBytes = 0;
    // eslint-disable-next-line no-restricted-syntax
    for await (const blob of containerClient.listBlobsFlat()) {
        iatiBytes += blob.properties.contentLength;
    }
    const gibIATI = Number(iatiBytes / (1024 * 1024 * 1024)).toFixed(2);

    // Azure Cost
    const costData = getMetricCost(await getRawCost(startDate, endDate));

    cost.startDate = startDate;
    cost.endDate = endDate;
    cost.value = costData.cost / gibIATI;

    await cost.save();

    // Get All Azure Resources for Azure Metrics
    const allResources = await getAllResources();

    // ACU

    const acuData = await getTotalACU(await getACU(allResources));

    acu.startDate = startDate;
    acu.endDate = endDate;
    acu.value = acuData / gibIATI;

    await acu.save();
};
