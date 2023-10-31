var express = require('express');
var router = express.Router();
// Importing the Book model
// const { Book } = require('../models') // For testing

/**
 * Handler function to wrap each route with. Reduces try.. catch blocks.
 * @param {function} cb 
 * @returns callback
 */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

  /* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect('/books')

  // // For initial testing
  // const books = await Book.findAll();
  // res.json(books);
}));

module.exports = router;
