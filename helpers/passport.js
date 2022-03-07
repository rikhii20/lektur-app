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
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
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
      clientID: "996627281269216",
      clientSecret: "95872e1ed9765c80f8083e746d474b08",
      callbackURL: process.env.FACEBOOK_CALLBACK_URI,
      profileFields: ["id", "displayName", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const user = await User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { fullName: profile.displayName },
      });
      cb(null, user);
    },
  ),
);
