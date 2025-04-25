import express, { Response, Request } from "express";
import config from "../config/config";
export const authRouter = express.Router();
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import { BACKEND_BASE_URL, FRONTEND_BASE_URL } from "../config/config";
import { isLoggedIn } from "../middleware";
import { isUserAuthenticated, logoutUser, saveUser } from "../controllers/auth";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: config.GOOGLE_CLIENT_ID || "",
      clientSecret: config.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${BACKEND_BASE_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      if (profile.emails && profile.photos) {
        const alreadyExist = await prisma.user.findFirst({
          where: {
            username: profile?.emails[0].value,
          },
        });

        if (alreadyExist) return cb(null, alreadyExist);

        //saving the user to db
        const newUser = await prisma.user.create({
          data: {
            username: profile.emails[0].value,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            emailVerified: profile.emails[0].verified,
            avatar: profile.photos[0].value,
            provider: profile.provider,
            providerId: profile.id,
          },
        });

        return cb(null, newUser);
      }
      return cb(true, undefined);
    }
  )
);

//put the user details in req.session.passport.user.authorizedUser

passport.serializeUser((user, done) => {
  done(null, user);
});

//put the req.session.passport.user to req.user

passport.deserializeUser((user: any, done) => {
  done(null, user.id);
});

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    return res.redirect(`${FRONTEND_BASE_URL}`);
  }
);

authRouter.get("/logout", isLoggedIn, logoutUser);

authRouter.get("/verify", isUserAuthenticated);
