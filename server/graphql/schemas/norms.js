const { gql } = require("apollo-server");

module.exports = gql`
type normCheck {
    Date: String
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

extend  type Query  {
    normCheckQuery: [normCheck]
    normCheckQueryNA: [normCheck]
} 
`;