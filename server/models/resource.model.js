const { db } = require('../config/configProvider')()

module.exports = function(DataTypes) {
    const Resource = db.define("resource", {
        nokiaID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shortID: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Resource;
}