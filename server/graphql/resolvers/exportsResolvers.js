module.exports = {

    Query: {
        async commentsCheckQuery(root, args, context) {
          console.log(args)
          let result = await db.query(`SELECT * FROM public.get_norms_comments_check('${args.department}')`);
          await console.log(result)
          return result[0];
    
        },
    }
}