const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");
const baseUrl = "https://lektur-apps.herokuapp.com";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SERVER_GOOGLE,
      callbackURL: `${baseUrl}/api/v1/user/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { fullName: profile.displayName },
      });
      cb(null, user);
    },
  ),
);

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID_FB,
      clientSecret: process.env.CLIENT_SERVER_FB,
      callbackURL: `${baseUrl}/api/v1/user/facebook/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { fullName: profile.displayName },
      });
      cb(null, user);
    },
  ),
);
