


module.exports = (sequelize, type) => {
  const extraHourItem = sequelize.define(
    "ExtraHours",
    {
      // id: {
      //   type: type.INTEGER,
      //   required: true,
      //   unique: true,
      //   primaryKey: true,
      // },
      start: {
        type: type.STRING,
        required: true,
      },
      end: {
        type: type.STRING,
        required: true,
      },
      duration: {
        type: type.STRING,
        required: true,
      },
      resource_email: {
        type: type.STRING,
        required: true,
      },
      date: {
        type: type.STRING,
      },
      domain: {
        type: type.STRING,
      },
      reason: {
        type: type.STRING,
      },
      scope: {
        type:type.BOOLEAN
      },
      service: {
        type:type.BOOLEAN
      },
      wbs: {
        type:type.BOOLEAN
      },
      creationDate:{type: type.DATE()},
      createdBy: { type: type.STRING },
    },
    { timestamps: false,
      tableName: 'extra_hours'
    },
   
  );
  return extraHourItem
  // Event.associate = (models) => {
  //   // associations can be defined here
  //   authoriseDate.belongsTo(db.User, { foreignKey: 'nokiaid', });
  // }
};
