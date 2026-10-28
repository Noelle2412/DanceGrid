import ResponseError from "../utils/ResponseError.js";
import passport from "passport";

export async function requireAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error) return next(error);
    if (!user) return next(new ResponseError("You must be logged in", 401));
    req.user = user;
    next();
  })(req, res, next);
}
