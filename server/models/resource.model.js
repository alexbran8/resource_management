module.exports = (sequelize, type) => {
    const Resource = sequelize.define("resource", {
        nokiaID: {
            type: type.STRING,
            allowNull: false
        },
        firstName: {
            type: type.STRING,
            allowNull: false
        },
        lastName: {
            type: type.STRING,
            allowNull: false
        },
        shortID: {
            type: type.STRING,
            allowNull: false
        }
    });

    return Resource;
}