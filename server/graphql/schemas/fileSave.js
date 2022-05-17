const { gql } = require("apollo-server");

module.exports = gql`

input capacityFile {
    RealHours: Float 
    HourCode: Float
}

extend type Mutation  {
    saveFile(data: [capacityFile]):Response!
}
`