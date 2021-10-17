module.exports = {

    Query: {
        async commentsCheckQuery(root, args, context) {
          console.log(args)
          let result = await db.query(`SELECT distinct to_char("Receive_Date", 'YYYY-MM') as "month"
          FROM public.capacity order by month desc;`);
          await console.log(result)
          return result[0];
    
        },
    }
}