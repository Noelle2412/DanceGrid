import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import passport from "./config/passport.js";
import usersRouters from "./routers/usersRouters.js";
import choreosRouters from "./routers/choreosRouters.js";
import errorHandler from "./middlewares/errorHandler.js";
import { connectDB } from "./db/db.js";

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.status(200).send("Welcome to the DanceGrid DataBase");
});

app.use("/users", usersRouters);

app.use("/choreos", choreosRouters);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`DanceGrid backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start DanceGrid:", error);
    process.exit(1);
  }
};

startServer();
