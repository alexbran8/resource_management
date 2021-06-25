const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const AzureOAuth2Strategy = require('passport-azure-ad-oauth2')
const keys = require("./keys");
const User = require("../models/user-model");
const config = require('../config2/config')
// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// deserialize the cookieUserId to user in the database
// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then(user => {
//       done(null, user);
//     })
//     .catch(e => {
//       done(new Error("Failed to deserialize an user"));
//     });
// });

  passport.serializeUser((profile, done) => {
    done(null, profile)
  })

  passport.deserializeUser((profile, done) => {
    done(null, profile)
  })


passport.use(
  'adfs',
  new AzureOAuth2Strategy(
    {
      clientID: config.azureApp.clientID,
      clientSecret: config.azureApp.clientSecret,
      callbackURL: config.azureApp.callbackUri,
      resource: config.azureApp.resource,
      tenant: config.azureApp.tenant
    },
    (accessToken, refreshToken, params, profile, done) =>
      adfsStrategy(
        accessToken,
        refreshToken,
        params,
        profile,
        done
      )
  )
)
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: keys.TWITTER_CONSUMER_KEY,
//       consumerSecret: keys.TWITTER_CONSUMER_SECRET,
//       callbackURL: "/auth/twitter/redirect"
//     },
//     async (token, tokenSecret, profile, done) => {
//       // find current user in UserModel
//       const currentUser = await User.findOne({
//         twitterId: profile._json.id_str
//       });
//       // create new user if the database doesn't have this user
//       if (!currentUser) {
//         const newUser = await new User({
//           name: profile._json.name,
//           screenName: profile._json.screen_name,
//           twitterId: profile._json.id_str,
//           profileImageUrl: profile._json.profile_image_url
//         }).save();
//         if (newUser) {
//           done(null, newUser);
//         }
//       }
//       done(null, currentUser);
//     }
//   )
// );


const adfsStrategy = require('./passport-adfs')
// module.exports = function (passport) {
//   passport.serializeUser((profile, done) => {
//     done(null, profile)
//   })

//   passport.deserializeUser((profile, done) => {
//     done(null, profile)
//   })

//   // ADFS signup strategy
//   passport.use(
//     'adfs',
//     new AzureOAuth2Strategy(
//       {
//         clientID: config.azureApp.clientID,
//         clientSecret: config.azureApp.clientSecret,
//         callbackURL: config.azureApp.callbackUri,
//         resource: config.azureApp.resource,
//         tenant: config.azureApp.tenant
//       },
//       (accessToken, refreshToken, params, profile, done) =>
//         adfsStrategy(
//           accessToken,
//           refreshToken,
//           params,
//           profile,
//           done
//         )
//     )
//   )
// }