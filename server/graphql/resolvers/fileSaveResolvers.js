module.exports = {

  Mutation: {
        async saveFile(root, args, context) {
          try {
          console.log(args.data)
          // let result = await db.query(`SELECT distinct to_char("Receive_Date", 'YYYY-MM') as "month"
          // FROM public.capacity order by month desc;`);
          // await console.log(result)
          // return result[0];
          }
          catch(error) {
            console.log(error)
          }
    
        },
    }
}