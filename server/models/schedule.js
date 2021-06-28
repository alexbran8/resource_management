const { db } = require("../config/configProvider")();

module.exports = function (DataTypes) {
  const Event = db.define(
    "events",
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   required: true,
      //   unique: true,
      //   primaryKey: true,
      // },
      start: {
        type: DataTypes.DATE(),
        required: true,
      },
      end: {
        type: DataTypes.DATE(),
        required: true,
      },
      nokiaid: {
        type: DataTypes.INTEGER,
        required: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      bgColor: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      task_admin: {
        type:DataTypes.BOOLEAN
      },
      task_operational: {
        type:DataTypes.BOOLEAN
      },
      status: {
        type: DataTypes.STRING,
      },
      replacement: { type: DataTypes.STRING },
      createdBy: { type: DataTypes.STRING },
    },
    { timestamps: false }
  );
  return Event;
};
