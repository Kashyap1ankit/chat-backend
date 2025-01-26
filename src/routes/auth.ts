import express, { Response, Request } from "express";
import config from "../config/config";
export const authRouter = express.Router();
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: config.GOOGLE_CLIENT_ID || "",
      clientSecret: config.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      return cb(null, profile);
    }
  )
);

//put the user details in req.session.passport.user.authorizedUser

passport.serializeUser((user, done) => {
  console.log("serialise user", user);
  done(null, user);
});

//put the req.session.passport.user to req.user

passport.deserializeUser((user: any, done) => {
  console.log("deserialize user", user);
  done(null, user.id);
});

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
  (req, res) => {
    return res.json({ message: "loggedin" });
  }
);
