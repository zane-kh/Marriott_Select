const mongoose = require("mongoose");

const dotenv = require("dotenv"); //connects env file
dotenv.config({ path: "./config.env" }); //read variables from file and save into NJS env variables

// uncaught exceptions from synchronous code, globally handle
// process.on("uncaughtException", (err) => {
//   console.log(err.name, err.message, err.stack, err.status);
//   console.log("UNCAUGHT EXCEPTION! Shutting down...");
//   server.close(() => {
//     process.exit(1);
//   });
// });

const app = require("./app");

console.log(app.get("env")); //determine environment
// console.log(process.env); //logs all environment variables

//start server
const port = 3000 || process.env.PORT;

//save server to variable to use in global error handling
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// //connect to atlas database
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(
    "mongodb+srv://zane-k:RmnKlID2xSYZHOqT@cluster0.eriwn.mongodb.net/marriott-select?retryWrites=true&w=majority"
  )
  .then(() => {
    // console.log(connection.connections);
    console.log("DB connection successful!");
  });

//unhandled rejections from asynchronous code, globally handle
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  //begin by closing server
  server.close(() => {
    //1 stands for uncaught exception
    //shuts down application
    process.exit(1);
  });
});
