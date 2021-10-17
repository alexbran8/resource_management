const { gql } = require("apollo-server");

module.exports = gql`

type months {
    month: String
  }

type capacityCheck {
    normalH: Float 
    nwH: Float
    nightH: Float
    resMarca: String

}

extend  type Query  {
    getMonthsQuery: [months]
    getCapacityHoursQuery(month:String): [capacityCheck]
}
`