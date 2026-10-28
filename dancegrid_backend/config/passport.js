import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/User.js";
import { validatePassword } from "../config/auth.js";

async function findOrCreateOAuthUser({
  provider,
  providerId,
  email,
  emailVerified,
}) {
  const idField = provider + "Id";

  let user = await UserModel.findOne({ [idField]: providerId });

  if (user) return user;

  if (email && emailVerified) {
    user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      user[idField] = providerId;
      await user.save();
      return user;
    }
  }

  return await UserModel.create({
    email,
    name,
    avatar,
    provider: "google",
    [idField]: providerId,
  });
}

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({
          email: email.toLowerCase().trim(),
        });
        if (!user || !user.password)
          return done(null, false, { message: "Invalid Credentials" });

        const matched = await validatePassword(password, user.password);
        if (!matched)
          return done(null, false, { message: "Invalid Credentials" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const cookieExtractor = (req) => req?.cookies?.token ?? null;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_TOKEN_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.id);
        return done(null, user || false);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerId: profile.id,
          email: profile.emails?.[0]?.value,
          emailVerified: profile._json.email_verified,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
