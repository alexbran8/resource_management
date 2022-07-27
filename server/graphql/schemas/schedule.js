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
    nightTask: Boolean
    recovery_date: String
}


type schiftedScheduleType {
  upi: String!
  engineer: String!
  department: String
  employeer: String
  week1: String
  week2: String
  week3: String
  week4: String
  week5: String
  type: String
}

extend type Mutation {
    addExtraHours(data:[extraHours], userEmail: String!):Response!
  }

extend type Query {
  getExtraHours(department:String, employeer: String, type: String):[schiftedScheduleType]
}
`