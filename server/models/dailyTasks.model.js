module.exports = (sequelize, type) => {
    const dailyTasks = sequelize.define("dailyTasks", {
    //         id: {
    //     type: type.INTEGER,
    //     required: true,
    //     unique: true,
    //     primaryKey: true,
    //   },
        projectName: {
            type: type.STRING,
            allowNull: true
        },
        resourceName:{
            type: type.STRING,
            allowNull: true
        },
        task: {
            type: type.STRING,
            allowNull: true
        },
        tt: {
            type: type.STRING,
            allowNull: true
        },
        status: {
            type: type.STRING,
            allowNull: true
        },
        phase: {
            type: type.STRING,
            allowNull: true
        },
        site: {
            type: type.STRING,
            allowNull: true
        },
        criticite: {
            type: type.STRING,
            allowNull: true
        },
        auteur: {
            type: type.STRING,
            allowNull: true
        },
        itv: {
            type: type.STRING,
            allowNull: true
        },
        description: {
            type: type.STRING
        },
        start: {
            type: type.DATE,
            allowNull: true
        },
        end: {
            type: type.DATE,
            allowNull: true
        },
        crDate: {
            type: type.DATE,
            allowNull: true
        },
        levelOfCompetence: {
            type: type.SMALLINT,
            defaultValue: 0
        },
        reviewed: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    });

    return dailyTasks;
}