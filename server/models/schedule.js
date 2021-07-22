


module.exports = (sequelize, type) => {
  const Event = sequelize.define(
    "events",
    {
      // id: {
      //   type: type.INTEGER,
      //   required: true,
      //   unique: true,
      //   primaryKey: true,
      // },
      start: {
        type: type.DATE(),
        required: true,
      },
      end: {
        type: type.DATE(),
        required: true,
      },
      nokiaid: {
        type: type.INTEGER,
        required: true,
      },
      title: {
        type: type.STRING,
      },
      bgColor: {
        type: type.STRING,
      },
      type: {
        type: type.STRING,
      },
      task_admin: {
        type:type.BOOLEAN
      },
      task_operational: {
        type:type.BOOLEAN
      },
      notifications: {
        type:type.BOOLEAN
      },
      status: {
        type: type.STRING,
      },
      norm: {
        type: type.NUMERIC,
      },
      creationDate:{type: type.DATE()},
      task_status: {
        type: type.STRING,
      },
      uid: {
        type: type.STRING,
      },
      replacement: { type: type.STRING },
      createdBy: { type: type.STRING },
    },
    { timestamps: false }
  );
  return Event;
};
