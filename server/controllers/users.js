const JWT = require('jsonwebtoken')
const sequelize = require('sequelize')
const { Op, DataTypes } = sequelize
const User = require('../models/user')(sequelize, DataTypes)
const { JWT_SECRET } = require('../config/configProvider')()
const UsersController = require('express').Router()
const passport = require('passport')
// require('../passport/passport')

exports.add = (req, res) => {
  console.log(req);
}


signToken = user => {
  return JWT.sign(
    {
      iss: 'NokiaTool',
      sub: user.nokiaid,
      role: user.level,
      name: `${user.firstname} ${user.lastname}`,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    JWT_SECRET
  )
}

UsersController.post('/signup', async (req, res, next) => {

  let foundUser = await User.findOne({
    where: { nokiaid: req.body.nokiaid },
    limit: 1
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Project."
    });
  });

  if (foundUser) {
    res.status(403).send({message:'nokiaid is in use.'})
  }

  foundUser = await User.findOne({ where: { email: req.body.email }, limit: 1 })

  if (foundUser) {
    res.status(403).send({message: 'Email is in use.'})
  }

  const newUser = new User(
    ({
      nokiaid,
      firstname,
      lastname,
      upi,
      city,
      employeer,
      shortid,
      main_team,
      second_team,
      third_team,
      activity,
      vacation_days,
      upalu,
      new_onnet,
      new_tel_fr,
      bandeau,
      start_date,
      level,
      email,
      fourth_team,
      marca,
      line_manager_firstname,
      line_manager_lastname,
      tpm_firstname,
      tpm_lastname,
      location_area,
      location_number,
      password
    } = req.body)
  )

  newUser.save()
  .then(data => {
    res.status(200).send({
      message: "Successfull!",
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Project."
    });
  });
})

UsersController.post(
  '/signin',
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    res.json({ token: signToken(req.user) })
  }
)

module.exports = UsersController
