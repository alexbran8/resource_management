const bcrypt = require('bcryptjs')
const { db } = require('../config/configProvider')()

module.exports = (sequelize, type) => {
  const User = db.define(
    'employees',
    {
      nokiaid: {
        type: type.STRING,
        required: true,
        unique: true,
        primaryKey: true
      },
      firstname: {
        type: type.STRING,
        required: true
      },
      lastname: {
        type: type.STRING,
        required: true
      },
      upi: {
        type: type.STRING
      },
      city: {
        type: type.STRING,
        required: true
      },
      employeer: {
        type: type.STRING,
        required: true
      },
      shortid: {
        type: type.STRING,
        required: true
      },
      main_team: {
        type: type.STRING
      },
      second_team: {
        type: type.STRING
      },
      third_team: {
        type: type.STRING
      },
      activity: {
        type: type.STRING,
        required: true
      },
      vacation_days: {
        type: type.NUMBER,
        required: false
      },
      upalu: {
        type: type.STRING
      },
      new_onnet: {
        type: type.STRING,
        required: true
      },
      new_tel_fr: {
        type: type.STRING,
        required: true
      },
      bandeau: {
        type: type.STRING,
        required: false
      },
      start_date: {
        type: type.DATE,
        required: false
      },
      level: {
        type: type.STRING,
        required: true
      },
      email: {
        type: type.STRING,
        required: true,
        unique: true
      },
      fourth_team: {
        type: type.STRING
      },
      marca: {
        type: type.STRING,
        required: false
      },
      line_manager_firstname: {
        type: type.STRING,
        required: true
      },
      line_manager_lastname: {
        type: type.STRING,
        required: true
      },
      location_area: {
        type: type.STRING,
        required: false
      },
      location_number: {
        type: type.STRING,
        required: false
      },
      tpm:{
        type: type.STRING,
        required:true
      },
      // password: {
      //   type: type.STRING,
      //   required: false
      // }
    },
    {
    //   hooks: {
    //     beforeCreate: user => {
    //       user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8))
    //     }
    //   },
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
