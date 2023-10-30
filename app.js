const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// importing db instance of sequlize from model/index.js
const db = require('./models');    // Accessing all Sequelizes methods and functionality

// Test connection to the DB
// async IIFE
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
    db.sequelize.sync();
    console.log('Sychronized the model with the db')
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();








const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// This was generated automatically and should serve static files
app.use(express.static(path.join(__dirname, 'public')));
// OR do I need to unclude this:
// app.use('/static', express.static('public'));


app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 error handler called');
  const error = new Error();
  error.status = 404;
  err.message = `Darn! You just hit a 404 error because this page doesn't exist.`
  console.log(error);
  // next(createError(404));  // automatically generated

  // NEED TO RENDER THE PAGE-NOT-FOUND and pass the {error} object !!!!!!!!!!!!!!!
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
