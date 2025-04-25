import { Response, Request, NextFunction } from "express";
import { FRONTEND_BASE_URL } from "../config/config";

//saving the user in db

export const isUserAuthenticated = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      user: req.session.passport.user,
    });
  }

  return res.status(400).json({
    user: null,
  });
};

//logging out the user by clearing the session

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next();
    res.redirect(`${FRONTEND_BASE_URL}`);
  });
};
