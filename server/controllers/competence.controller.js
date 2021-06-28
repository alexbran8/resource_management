const { db } = require("../config/configProvider")();
// const Competence = db.competences;
const sequelize = require("sequelize");
const { DataTypes, Op } = sequelize;
const Competence = require("../models/competence.model")(sequelize, DataTypes);
// const Op = db.Sequelize.Op;

// Retrieve all Competences from the database.
exports.findAll = (req, res) => {
    const task = req.query.task;
    var condition = task ? { task: { [Op.like]: `%${task}%` } } : null;

    Competence.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Competences."
      });
    });
};

// Find a single Competence with an id 
exports.findOne = (req, res) => {
    const id = req.params.id;

    Competence.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err =>{
            res.status(500).send({
                message: "Error retrieving Project with id=" + id
            });
        })
};

// Update a Competence by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Competence.update(req.body, {
        where: { id: id }
    })
        .then(num => {
        if (num == 1) {
            res.send({
            message: "Competence was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Competence with id=${id}. Maybe Competence was not found or req.body is empty!`
            });
        }
        })
        .catch(err => {
        res.status(500).send({
            message: "Error updating Competence with id=" + id
        });
        });
};

// Delete a Competence with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    
    Competence.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Competence was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Competence with id=${id}. Maybe Competence was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Competence with id=" + id
          });
        });
};

// Delete all Competences from the database.
exports.deleteAll = (req, res) => {
    Competence.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Competences were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Competences."
          });
        });
};
