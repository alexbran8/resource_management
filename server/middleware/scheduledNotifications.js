const db = require("../models");
const Op = db.Sequelize.Op;

const scheduledNotifications = async () => {
    const currentDate = new Date();
    const notifications = db.Schedule.findAll({
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