const { gql } = require("apollo-server");

module.exports = gql`



input extraHours {
    date: String!
    domain: String!
    start: String!
    end: String
    duration: String!
    reason: String!
    scope: String!
    service: String!
    wbs: String!
}


extend type Mutation {
    addExtraHours(data:[extraHours], userEmail: String!):Response!
  }
`