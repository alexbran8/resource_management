const sequelize = require("sequelize");
const { DataTypes, Op } = sequelize;
// const Schedule = require("../models/schedule")(sequelize, DataTypes);
const Notifications = require("../models/notifications.model")(sequelize, DataTypes);


const scheduledNotifications = async () => {
    const currentDate = new Date();
    const notifications = Schedule.findAll({
        where: {
            [Op.and]: [{
                start: {
                    [Op.lte]: currentDate
                }
            },  { notifications: true }
            ]
        },
    }
    );
    console.log('found notifications', await notifications)
}


module.exports = scheduledNotifications