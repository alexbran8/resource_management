const jwt = require('jsonwebtoken')

module.exports = function (
  accessToken,
  refreshToken,
  params,
  profile,
  done
) {
  console.log(`**Passport ADFS strategy...`)
  const userProfile = jwt.decode(params.id_token, '', true)
  // New user
  console.log(`**New ADFS user...`)

  console.log(JSON.stringify(userProfile))
  console.log(profile)
  console.log(params)

  var user = {
    id: userProfile.aud,
    groups: userProfile.groups,
    email: userProfile.unique_name,
    first_name: userProfile.given_name,
    last_name: userProfile.family_name,
    // check how to add multiple roles
    roles: userProfile.roles[0],
    provider: 'adfs',
    exp: new Date(1000*userProfile.exp)
  }
  console.log(userProfile.roles[0])
  console.log(`**ADFS user added...`)
  return done(null, user)
}
