// const dbConfig = require("../config/config.js");
// console.log(dbConfig.db)

const Sequelize = require("sequelize");

const sequelize = new Sequelize("npt", "postgres", "fJdyP2Dyj@&6v!5hMM#VD", {
    host: "10.129.210.150",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.dailyTasks.model = require("./dailyTasks.model.js")(sequelize, Sequelize);
db.Schedule = require("./schedule.js")(sequelize, Sequelize);
db.Project = require("./dailyTasks.model.js")(sequelize, Sequelize);
db.User= require("./user.js")(sequelize, Sequelize);


db.User.hasMany(db.Schedule,{foreignKey: 'nokiaid'});
db.Schedule.belongsTo(db.User,{foreignKey: 'nokiaid'});
// db.gallery = require("./gallery.js")(sequelize, Sequelize);
// db.cartItem = require("./cartItem.js")(sequelize, Sequelize);
// db.tags = require("./tags.js")(sequelize, Sequelize);
// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
// db.comments = require("./comment.model.js")(sequelize, Sequelize);


// db.comments.belongsTo(db.tutorials, {
//   foreignKey: "tutorialId",
//   as: "tutorial",
// });

// db.gallery.hasMany(db.tags, { as: "tags" });
// db.tags.belongsTo(db.gallery, {
//   foreignKey: "item",
//   as: "item",
// });

module.exports = db;
