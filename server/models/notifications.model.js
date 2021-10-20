

module.exports = (sequelize, type) => {
  const notification =  sequelize.define(
    "scheduled_notifications",
    {
      uid: {
        type: type.STRING,
      },
      value: {
        type: type.NUMERIC,
      },
      creationDate:{type: type.DATE()},
      createdBy: { type: type.STRING },
    },
    { timestamps: false }
  );
  return notification;
};
