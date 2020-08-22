const cds = require('@sap/cds'),
    logger = require("cf-nodejs-logging-support");
const __DEBUG = true;
cds.on('bootstrap', (app) => {
    __DEBUG && app.use(logger.logNetwork);
});
cds.on('served', () => { });
module.exports = cds.server;