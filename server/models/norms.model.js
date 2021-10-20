module.exports = (sequelize, type) => {
  const norm = sequelize.define(
    "Norms",
    {
      // id: {
      //   type: type.INTEGER,
      //   required: true,
      //   unique: true,
      //   primaryKey: true,
      // },
      departmen: {
        type: type.STRING(),
        required: true,
      },
      project: {
        type: type.STRING(),
        required: true,
      },
      wbs: {
        type: type.INTEGER,
        required: true,
      },
    },
    { timestamps: false,
      tableName: 'npt_norms_capacity'
    },
   
  );
  return norm
  // Event.associate = (models) => {
  //   // associations can be defined here
  //   authoriseDate.belongsTo(db.User, { foreignKey: 'nokiaid', });
  // }
};
