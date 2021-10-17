const db = require("../../models");

module.exports = {

  Query: {
    async getMonthsQuery(root, args, context) {
      let result = await db.sequelize .query(`SELECT distinct to_char("Receive_Date", 'YYYY-MM') as "month"
      FROM public.capacity order by month desc;`);
      return result[0];

    },
    async getCapacityHoursQuery(root, args, context) {
      console.log(typeof args.month)
      let result = await db.sequelize .query(`SELECT * FROM public.invoice_check('
        ${args.month}
      ')`);
      await console.log(result[0])
      return result[0];

    },
}
}