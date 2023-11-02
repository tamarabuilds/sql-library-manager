const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// importing db instance of sequlize from model/index.js
const db = require("./models"); // Accessing all Sequelizes methods and functionality

// Test connection to the DB
// async IIFE
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection to the database successful!");
    db.sequelize.sync();
    console.log("Sychronized the model with the db");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();

const routes = require("./routes/index");
const books = require("./routes/books");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// This was generated automatically and should serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/books", books);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("404 error handler called");
  const error = new Error();
  error.status = 404;
  error.message = `Sorry! We couldn't find the page you were looking for.`;
  // Send the 404 error to the global error handler
  next(error);
});

// error handler
app.use(function (error, req, res, next) {
  // confirm there's an error
  if (error) {
    console.log(`Global error handler called`);
  }
  // check for 404 err, if so render page-not-found
  if (error.status === 404) {
    res.status(404);
    error.message = `Sorry! We couldn't find the page you were looking for.`;
    res.render("page-not-found", { error, title: 'Page Not Found' });
  } else {
    // render the error page
    error.message =
      error.message || "Sorry! There was an unexpected error on the server.";
    res.status(error.status || 500);
    console.log(`Error status: ${error.status}`);
    console.log(`Error message: ${error.message}`);
    console.log(error);
    res.render("error", { error, title: 'Server Error' });
  }
});

module.exports = app;
