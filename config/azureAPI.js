const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const config = require('./config');

let token = null;

module.exports.getBearerToken = async () => {
    if (token != null) {
        return token;
    }
    const vars = [
        'AZURE_CLIENT_ID',
        'AZURE_CLIENT_SECRET',
        'AZURE_TENANT_ID',
        'AZURE_SUBSCRIPTION_ID',
    ];
    vars.forEach((item) => {
        if (!config[item]) {
            throw Error('Expected variable not present: ', item);
        }
    });

    try {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

        const urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'client_credentials');
        urlencoded.append('client_id', config.AZURE_CLIENT_ID);
        urlencoded.append('client_secret', config.AZURE_CLIENT_SECRET);
        urlencoded.append('resource', 'https://management.azure.com/');

        const response = await fetch(
            `https://login.microsoftonline.com/${config.AZURE_TENANT_ID}/oauth2/token`,
            {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
            }
        );
        const data = await response.json();
        token = { access_token: data.access_token, expires_on: data.expires_on };
        return token;
    } catch (error) {
        console.error('Error fetching token', error);
        return error;
    }
};
