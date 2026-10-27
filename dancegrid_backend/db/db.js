import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let URI = process.env.MongoDB_URI;
const promise = mongoose.connect(URI);

promise
  .then(() => {
    console.log("Initialized connection to Database");
  })
  .catch((error) => {
    console.log("Connection with ToDos Database failed");
    console.log(error);
  });

mongoose.connection.on("connected", () => {
  console.log("Database found");
});

mongoose.connection.on("error", (error) => {
  console.log("Database not found");
});

export default URI;
