const { gql } = require("apollo-server");

module.exports = gql`
type normCheck {
  uid:String
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
    correction: String
    Dep: String
  }
  type capacityLawson {
    uid: String
    Dep: String  
	  Date: String 
	  Resource: String 
	  UPI:String
	  to_email: String
	  wbsCustomer: String
    workFolderCode: String
    wbsCheck: String
	  sumCapacity: String
	  sumLawson: String
	  variation: String
	  correction: String
  }
  type commentsCheck {
    uid: String
    Dep: String  
	  Date: String 
	  Resource: String 
	  to_email: String
	  wbsCustomer: String
    Task: String
    taskComments: String
    timeWrittingComments: String
    result: String
  }

  input commentsCheckInput {
    uid: String
    dep: String  
	  date: String 
	  resource: String 
	  to_email: String
	  wbsCustomer: String
    task: String
    taskComments: String
    twc: String
    result: String
  }

  input capacityLawsonInput {
    type: String!
    uid: String!
    Dep: String  
	  date: String! 
	  resource: String!
	  to_email: String!
	  wbsCustomer: String!
    workFolderCode: String
    wbsCheck: String
	  sumCapacity: String
	  sumLawson: String
	  var: String
	  correction: String
  }

  input notificationInput {
    value: String!
    label: String!
  }


  type Response {
    success: String!
    message: String!
  }

  type Tasks {
    Capacity: String
    Norm_OK: String
    Norm_NOK_RA: String
    id: Int
  }

  input addTask {
    task: String!
    task_status: String
    comments: String
    start: String
    norm: Float
    end: String
    nokiaid:Int
    id: Int
   }

  input Norms {
    type: String!
    uid: String
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
    correction: String
    Dep: String
   }

extend  type Query  {
    normCheckQuery(department: String!): [normCheck]
    capacityLawsonQuery(department: String!): [capacityLawson]
    normCheckQueryNA: [normCheck]
    getTasksQuery(department: String!): [Tasks]
    commentsCheckQuery(department: String!): [commentsCheck]
} 

extend type Mutation {
  addTask(data:[addTask], notifications:[notificationInput]):Response!
  sendNotifications (data: [Norms], data2:[capacityLawsonInput], data3:[commentsCheckInput]):Response!
}
`;