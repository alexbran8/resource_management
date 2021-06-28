function authCheckMiddleware () {
  return function (req, res, next) {
    console.log('req',req)
    if (req.isAuthenticated()) {
      next()
    } else {
      // res.redirect('/auth/login-adfs')
      next({
        status: 401,
        message: 'Error: User not logged in.'
      })
    }
  }
}

module.exports = authCheckMiddleware
