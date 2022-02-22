const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const { getBearerToken } = require('../config/azureAPI');
const config = require('../config/config');

module.exports.getMetricCost = (rawCost) => {
    const total = rawCost.properties.rows.reduce(
        (acc, val) => Number(acc) + Number(val[1]),
        Number(0)
    );
    return { cost: total.toFixed(2), currency: 'USD' };
};

module.exports.getRawCost = async (fromDate, endDate) => {
    try {
        const token = await getBearerToken();

        const myHeaders = new Headers();
        // auth
        // const token = await getBearerToken();
        myHeaders.append('Authorization', `Bearer ${token.access_token}`);
        myHeaders.append('Content-Type', 'application/json');

        const body = JSON.stringify({
            type: 'ActualCost',
            dataSet: {
                granularity: 'Daily',
                aggregation: {
                    totalCost: {
                        name: 'Cost',
                        function: 'Sum',
                    },
                    totalCostUSD: {
                        name: 'CostUSD',
                        function: 'Sum',
                    },
                },
                sorting: [
                    {
                        direction: 'ascending',
                        name: 'UsageDate',
                    },
                ],
            },
            timeframe: 'Custom',
            timePeriod: {
                from: fromDate.toISOString(),
                to: endDate.toISOString(),
            },
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body,
            redirect: 'follow',
        };

        const response = await fetch(
            `https://management.azure.com/subscriptions/${config.AZURE_SUBSCRIPTION_ID}/providers/Microsoft.CostManagement/query?api-version=2021-10-01`,
            requestOptions
        );

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
