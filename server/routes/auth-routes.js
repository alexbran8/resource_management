const router = require("express").Router();
const passport = require("passport");
// const CLIENT_HOME_PAGE_URL = "http://localhost:3000"
console.log(process.env.NODE_ENV)
const CLIENT_HOME_PAGE_URL = process.env.NODE_ENV === `development` ? "http://localhost:3000" :  'https://apps.gdceur.eecloud.dynamic.nsn-net.net/nptbeta/';

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
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

// auth with twitter
router.get("/twitter", passport.authenticate("adfs"));

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect/auth/cbAdfs",
  passport.authenticate("adfs", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

module.exports = router;
