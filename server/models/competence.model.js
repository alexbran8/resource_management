const { db } = require("../config/configProvider")();

module.exports = function (DataTypes) {
    const Competence = db.define("competence", {
        task: {
            type: DataTypes.STRING,
            allowNull: false
        },
        project: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resourceName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        site: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Competence;
}