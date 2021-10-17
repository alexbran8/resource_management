const { gql } = require("apollo-server");

const normCheck = require("./norms");
const invoiceCheck = require("./invoiceCheck");


const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

module.exports = [rootType, normCheck, invoiceCheck];
