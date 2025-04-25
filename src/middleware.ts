import { Request, Response, NextFunction } from "express";

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isAuthenticated = req.isAuthenticated();
    console.log(req.isAuthenticated());
    if (!isAuthenticated) throw new Error();
    next();
  } catch (error) {
    res.redirect("/login");
  }
}
