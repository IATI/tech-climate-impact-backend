require('../config/db/database');
const Metric = require('../config/db/models/metric');

module.exports = async (context, req) => {
    const { enddate: endDate, startdate: startDate } = req.query;

    if (!endDate || !startDate) {
        context.res = {
            status: 422,
            body: { error: `enddate and startdate are required query parameters` },
        };
        return;
    }

    const res = await Metric.find({ endDate: { $gte: startDate, $lte: endDate } });

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: res,
    };
};
