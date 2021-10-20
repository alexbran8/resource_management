const db = require("../../models");

module.exports = {

  Mutation: {
    async addExtraHours(root, args, context) {
      try {
        console.log(args)
        const extraHour = db.ExtraHours
        newItem = new extraHour(
          ({
            date,
            start,
            end,
            domain,
            service,
            reason,
            scope,
            wbs
          } = args.data[0])
        );
        newItem.resource_email = args.userEmail
        await newItem.save();
        const response = { message: 'Added', success: true }
        return response
      }
      catch (error) {
        console.log(error)
        const response = { message: error, success: false }
        return response
      }
    },
  }
}