import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import todosRouters from "./routers/todosRouters.js";
import usersRouters from "./routers/usersRouters.js";
import tagsRouters from "./routers/tagsRouters.js";
import errorHandler from "./middlewares/errorHandler.js";
import _uri from "./db/db.js";

const app = express();
app.use(morgan(":method :user-agent :url :status"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

app.get("/", (req, res, next) => {
  res.status(200).send("Welcome to the ToDos Management Page.");
});

app.use("/todos", todosRouters);
app.use("/users", usersRouters);
app.use("/tags", tagsRouters);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`ToDos management page is running on port ${process.env.PORT}`);
});
