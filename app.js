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


const routes = require('./routes/index');
const books = require('./routes/books');

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


app.use('/', routes);
app.use('/books', books);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 error handler called');
  const error = new Error();
  error.status = 404;
  error.message = `Sorry! We couldn't find the page you were looking for.`
  // next(createError(404));  // automatically generated. What is createError()
  // Send the 404 error to the global error handler
  next(error);
});

// error handler
app.use(function(error, req, res, next) {
  // Commenting out what was automatically generated, but is it a better practice????
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // confirm there's an error
  if (error){
    console.log(`Global error handler called`);
    // console.log(error);
  }
  // check for 404 err, if so render page-not-found
  if (error.status === 404){
    res.status(404);
    // If sendStatus(404), making sure the error message is also updated ??????
    error.message = `Sorry! We couldn't find the page you were looking for.`
    res.render('page-not-found', { error })
  } else {
    // render the error page
    error.message = error.message || 'Sorry! There was an unexpected error on the server.';
    res.status(error.status || 500);
    console.log(`Error status: ${error.status}`)
    console.log(`Error message: ${error.message}`)
    console.log(error)
    res.render('error', { error });

  }



});

module.exports = app;
