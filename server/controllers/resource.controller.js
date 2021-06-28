const { db } = require("../config/configProvider")();
const sequelize = require("sequelize");
const { DataTypes, Op } = sequelize;
const User = require("../models/user")(sequelize, DataTypes);


// Retrieve all Resources from the database.
exports.findAll = (req,res) => {
    const shortId = req.query.shortID;
    var condition = shortId ? { shortId: { [Op.like]: `%${shortId}%` } } : null;

    User.findAll({ where : condition })
    .then(data => {
      console.log(data)
        var names = [];
        for(var i = 0; i< data.length; i++){
          names.push(data[i].firstname + ' ' + data[i].lastname);
        }
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Resources."
        });
      });
}