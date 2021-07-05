const { gql } = require("apollo-server");

module.exports = gql`
type normCheck {
    Date: String
    to_email: String
    Resource: String
    wbsCustomer: String
    Task: String
    taskComments: String
    timeWrittingComments: String
    billableHours: String
	  realHour: String
	  normOK: String
	  normNOK:  String
	  status: String
    variation: String
  }
  type Response {
    success: String!
    message: String!
  }

  input Norms {
    id: Int
    to_email: String
    date: String
    resource: String
    wbsCustomer: String
    task: String
    taskComments: String
    twc: String
    bh: String
	  rh: String
	  normOK: String
	  normNok:  String
	  status: String
    var: String
   }

extend  type Query  {
    normCheckQuery(department: String!): [normCheck]
    normCheckQueryNA: [normCheck]
} 

extend type Mutation {
  sendNotifications (data: [Norms]):Response!
}
`;