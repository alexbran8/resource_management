const router = require("express").Router();
const passport = require("passport");
// const CLIENT_HOME_PAGE_URL = "http://localhost:3000"
console.log(process.env.NODE_ENV)
const CLIENT_HOME_PAGE_URL = process.env.NODE_ENV === `development` ? "http://localhost:3000" :  'https://apps.gdceur.eecloud.dynamic.nsn-net.net/npt';
const config = require("../config/config")

  //secured api routes with no redirect
  function authorizeApi(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } 
      else return     res.status(401).json({
       message : "User Not Authenticated",
       user : null,
       success: false,
     })
    
}

// when login is successful, retrieve user info
router.get("/login/success",authorizeApi, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully been authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with azure
router.get("/azure", passport.authenticate("adfs"));

// redirect to home page after successfully login via twitter
router.get(
  "/azure/redirect/auth/cbAdfs",
  passport.authenticate("adfs", {
    successRedirect: config.CLIENT_HOME_PAGE_URL,
    failureRedirect: config.CLIENT_ERROR_URL
  })
);

module.exports = router;
