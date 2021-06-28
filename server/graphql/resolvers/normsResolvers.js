const { db } = require("../../config/configProvider")();

module.exports = { Query: {
    async normCheckQuery(root, args, context) {
      let result = await db.query(`SELECT * FROM get_norms_check()`);
      return result[0];

    },

    async normCheckQueryNA(root, args, context) {
      let result = await db.query(`SELECT * FROM get_norms_na()`);
      console.log('y')
      return result[0];

    }
}
}
