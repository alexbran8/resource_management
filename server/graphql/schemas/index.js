const { gql } = require("apollo-server");

const normCheck = require("./norms");
const invoiceCheck = require("./invoiceCheck");
const schedule = require("./schedule");
const fileSave = require("./fileSave")


const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

module.exports = [rootType, normCheck, invoiceCheck, schedule, fileSave];
