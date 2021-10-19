const db = require("../../models");

module.exports = {

  Mutation: {
    async addExtraHours(root, args, context) {
      console.log(args)
      const response = { message: 'Added', success: true }
      return response
    },
  }
}