const { db } = require('../config/configProvider')()

module.exports = function(DataTypes) {
  const Type = db.define(
    'types',
    {
      type: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        primaryKey: true
      },
      bgColor: {
        type: DataTypes.STRING
      },
      replacement: {
        type: DataTypes.STRING
      }
    },
    { timestamps: false }
  )

  return Type
}
