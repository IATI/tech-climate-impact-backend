# azure-function-node-microservice-template

## Prerequisities

-   nvm - [nvm](https://github.com/nvm-sh/nvm) - Node version manager
-   Node LTS
    -   This will be the latest LTS version supported by Azure Functions, set in `.nvmrc`
    -   once you've installed nvm run `nvm use` which will look at `.nvmrc` for the node version, if it's not installed then it will prompt you to install it with `nvm install <version> --latest-npm`
-   npm >=7
    -   nvm will install the version of npm packaged with node. make sure to use the `--latest-npm` flag to get the latest version
    -   If you forgot to do that install the latest version of npm with `npm i -g npm`
-   [Azure Functions Core Tools v3](https://github.com/Azure/azure-functions-core-tools)
-   [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) version 2.4 or later.

## Getting Started

1. Create a new repository from the template
1. Follow instructions for nvm/node prerequisties above
1. Update package.json with application name, repository, etc.
1. Run `npm i`
1. Run `npm start` to run the function locally using the Azure Functions Core Tools

## Environment Variables

### Set Up

`cp .env.example .env`

### Description

`APPINSIGHTS_INSTRUMENTATIONKEY`

-   Needs to be set for running locally, but will not actually report telemetry to the AppInsights instance in my experience

### Adding New

Add in:

1. .env.example
1. .env
1. `/config/config.js`

Import

```
const config = require("./config");

let myEnvVariable = config.ENV_VAR
```

## Attached Debugging (VSCode)

-   Set a breakpoint
-   Press F5 to start the Azure Function and Attach the VSCode debugger
    -   Configuration is contained in `.vscode/launch.json` and `.vscode/tasks.json`
-   Trigger a request that will hit your break point
-   Enojy!

## Linting and Code Formatting

### Prerequisities

-   To show linting inline install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSCode

### Info

-   This is done with eslint following the airbnb-base style and using [Prettier](https://prettier.io). Implemented with [this](https://sourcelevel.io/blog/how-to-setup-eslint-and-prettier-on-node) guide.
-   If you use VSCode the formatting will happen automagically on save due to the `.vscode/settings.json` > `"editor.formatOnSave": true` setting

## Endpoints /api

### `GET /pub/version`

-   Returns application version from `package.json`

```
<0.0.0>
```

### `GET /metrics?startdate=<date>&enddate=<date>`

Returns Metrics for that time period

## Creating a new route

`func new --name <routename> --template "HTTP trigger" --authlevel "Function"`

## AppInsights SDK

-   An example of using the `config/appInsights.js` utility is available in the `pvt-get/index.js` where execution time of the function is measured and then logged in 2 ways to the AppInsights Telemetry.

## Integration Tests

### Running

-   Install newman globally `npm i -g newman`
-   Start function `npm start`
-   Run Tests `npm test`

### Modifying/Adding

Integration tests are written in Postman v2.1 format and run with newman
Import the `integration-tests/tech-climate-impact-integration-tests.postman_collection.json` into Postman and write additional tests there

## Deployment

-   Update relevant items in `.github/workflows/func-deploy.yml`
-   Create a [Service Principal](https://github.com/IATI/IATI-Internal-Wiki/blob/main/IATI-Unified-Infra/ServicePrincipals.md) and set the DEV_AZURE_CREDENTIALS GitHub Secret
