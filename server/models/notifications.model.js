const { db } = require("../config/configProvider")();

module.exports = function (DataTypes) {
  const notification = db.define(
    "scheduled_notifications",
    {
      to_email: {
        type: DataTypes.STRING,
      },
      task: {
        type: DataTypes.STRING,
      },
      uid: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.NUMERIC,
      },
      creationDate:{type: DataTypes.DATE()},
      createdBy: { type: DataTypes.STRING },
    },
    { timestamps: false }
  );
  return notification;
};
