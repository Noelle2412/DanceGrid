import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

export function createToken(user) {
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "14d",
  });
  return jwtToken;
}

export function validatePassword(inputPassword, password) {
  return bcrypt.compare(inputPassword, password);
}

const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;

export function setAuthCookie(res, user) {
  res.cookie("token", createToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: FOURTEEN_DAYS,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    provider: user.proivder,
  };
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new ResponseError("This email is already registered", 400);
    }
    const hashedPassword = await createPassword(password);
    const newUser = { email, password: hashedPassword };
    await UserModel.create(newUser);
    setAuthCookie(res, newUser);
    res.status(201).json({
      message: "User created successfully!",
      user: publicUser(newUser),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) return next(error);
    if (!user)
      return next(
        new ResponseError(info?.message || "Invalid Credentials", 400),
      );
    setAuthCookie(res, user);
    res
      .status(200)
      .json({ message: "Login successful", user: publicUser(user) });
  })(req, res, next);
}
