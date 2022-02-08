
const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { User } = require("../models")
const baseUrl = "https://lektur-apps.herokuapp.com"

passport.use(
    "google",
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SERVER,
        callbackURL: `${baseUrl}/api/v1/user/google/callback`,
      },    
        async function (accessToken, refreshToken, profile, cb) {
            const user = await User.findOrCreate({
                where : {email : profile.emails[0].value},
                defaults : { fullName : profile.displayName}
            });
            cb(null, user)
        }
    )
);