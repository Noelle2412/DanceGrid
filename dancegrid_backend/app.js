import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import usersRouters from "./routers/usersRouters.js";
import errorHandler from "./middlewares/errorHandler.js";
import _uri from "./db/db.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded());

app.get("/", (req, res, next) => {
  res.status(200).send("Welcome to the DanceGrid DataBase");
});

app.use("/users", usersRouters);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`DanceGrid Database is running on port ${process.env.PORT}`);
});
