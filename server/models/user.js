const bcrypt = require('bcryptjs')
const { db } = require('../config/configProvider')()

module.exports = function(DataTypes) {
  const User = db.define(
    'employees',
    {
      nokiaid: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        primaryKey: true
      },
      firstname: {
        type: DataTypes.STRING,
        required: true
      },
      lastname: {
        type: DataTypes.STRING,
        required: true
      },
      upi: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING,
        required: true
      },
      employeer: {
        type: DataTypes.STRING,
        required: true
      },
      shortid: {
        type: DataTypes.STRING,
        required: true
      },
      main_team: {
        type: DataTypes.STRING
      },
      second_team: {
        type: DataTypes.STRING
      },
      third_team: {
        type: DataTypes.STRING
      },
      activity: {
        type: DataTypes.STRING,
        required: true
      },
      vacation_days: {
        type: DataTypes.NUMBER,
        required: false
      },
      upalu: {
        type: DataTypes.STRING
      },
      new_onnet: {
        type: DataTypes.STRING,
        required: true
      },
      new_tel_fr: {
        type: DataTypes.STRING,
        required: true
      },
      bandeau: {
        type: DataTypes.STRING,
        required: false
      },
      start_date: {
        type: DataTypes.DATE,
        required: false
      },
      level: {
        type: DataTypes.STRING,
        required: true
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true
      },
      fourth_team: {
        type: DataTypes.STRING
      },
      marca: {
        type: DataTypes.STRING,
        required: false
      },
      line_manager_firstname: {
        type: DataTypes.STRING,
        required: true
      },
      line_manager_lastname: {
        type: DataTypes.STRING,
        required: true
      },
      tpm_firstname: {
        type: DataTypes.STRING,
        required: true
      },
      tpm_lastname: {
        type: DataTypes.STRING,
        required: true
      },
      location_area: {
        type: DataTypes.STRING,
        required: false
      },
      location_number: {
        type: DataTypes.STRING,
        required: false
      },
      password: {
        type: DataTypes.STRING,
        required: false
      }
    },
    {
      hooks: {
        beforeCreate: user => {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8))
        }
      },
      freezeTableName: true
    }
  )

  User.prototype.validPassword = async function(password) {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      throw new Error(error)
    }
  }

  return User
}
