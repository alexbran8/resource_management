const Sequelize = require("sequelize");
require('dotenv').config({ path: '../.env' });
/* 
 * create a `.env` file with environment variables in order to laod at runtime.
*/

const hostUrl = process.env.NODE_ENV === `development` ? "http://localhost:4000/auth/azure/redirect" :  `${process.env.HOST_URL}/auth/azure/redirect`;
const baseLocation = process.env.NODE_ENV === `development` ? "" :  '/npt';



var config = {
  CLIENT_HOME_PAGE_URL: process.env.NODE_ENV === `development` ? "http://localhost:3000/#/" :  `${process.env.HOST_URL}`,
  CLIENT_ERROR_URL: process.env.NODE_ENV === `development` ? "http://localhost:3000/#/error" :  `${process.env.HOST_URL}/#/error`,
  azureApp: {
    // Azure Application details
    base: process.env.AAD_AUTH_URL || 'https://login.microsoftonline.com/',
    clientID: process.env.AAD_AUTH_CLIENTID || 'ae919e4c-3cba-44d7-80d6-f94ea0898d7d',
    clientSecret: process.env.AAD_AUTH_CLIENTSECRET || '3468Q~asOKu2EViNzg-gIlcF6FZQ4JkLY9KEibUd',
    callbackUri: hostUrl + '/auth/cbAdfs',
    resource: process.env.MS_GRAPH_URL || 'https://graph.microsoft.com/',
    tenant: process.env.AAD_AUTH_TENANT || '5d471751-9675-428d-917b-70f44f9630b0'
  },
  baseLocation: baseLocation,
  jwtSecret: process.env.APP_SESSION_SECRET || 'big Secret',
  cookieSettings: {
    maxAge: 360000
  },
  serverPort: process.env.PORT || 8080,
  db: new Sequelize("npt", "postgres", "fJdyP2Dyj@&6v!5hMM#VD", {
    host: "10.129.210.150",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }),
}

module.exports = config
