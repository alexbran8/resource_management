// const { db } = require("../models")();
// const db = require("../models");const db = require("./models");

// const { sequelize } = require(".");

module.exports = function (DataTypes, seequelize) {
    const dailyTasks = seequelize.define("dailyTasks", {
    //         id: {
    //     type: DataTypes.INTEGER,
    //     required: true,
    //     unique: true,
    //     primaryKey: true,
    //   },
        projectName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resourceName:{
            type: DataTypes.STRING,
            allowNull: true
        },
        task: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tt: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phase: {
            type: DataTypes.STRING,
            allowNull: true
        },
        site: {
            type: DataTypes.STRING,
            allowNull: true
        },
        criticite: {
            type: DataTypes.STRING,
            allowNull: true
        },
        auteur: {
            type: DataTypes.STRING,
            allowNull: true
        },
        itv: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING
        },
        start: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end: {
            type: DataTypes.DATE,
            allowNull: true
        },
        crDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        levelOfCompetence: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        reviewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return dailyTasks;
}