const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");

/* Handler function to wrap each route. */
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

/* GET error route to throw 500 server error for testing */
router.get("/error", (req, res, next) => {
    console.log(`Custom error route called`);
    const err = new Error(`Custom 500 error message. Please try another page.`);
    err.status = 500;
    throw err;
});

/* GET full list of books */
router.get('/', asyncHandler(async (req, res) => {
    console.log(`GET full list of books - start`)
    console.log(`req.query.search: ${req.query.search}`)
    const search = req.query.search || "";
    const books = await Book.findAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        // like is case insensitive in sqlite by default: https://sqlite.org/faq.html#q18
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    author: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    genre: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    year: {
                        [Op.like]: `%${search}%`
                    }
                },
            ]
        }
    });
    res.render("books/index", { books, title: "Books"});
}));

/* Create a new book form */
router.get('/new', (req, res) => {
    res.render("books/new", { book: {}, title: "New Book" });
});

/* POST create a new book */
router.post('/', asyncHandler(async (req, res) => {
    console.log(`posting a new book`)
    // new book varible
    let book;
    try {
        // set book variable to the Book model, created with the request body data
        book = await Book.create(req.body);
        // redirect back to the full book list
        res.redirect("/books");
    } catch (error) {
        console.log(error)
        console.log(`error.name  is ${error.name}`)
        if (error.name === "SequelizeValidationError"){   // checking the error type
            console.log(`we have the right error`)
            console.log(error.errors)
            book = await Book.build(req.body);
            res.render("books/new", { book, errors: error.errors, title: "New Book" })
          } else {
            throw error;
        }
    }
}));

/* GET individual book */
router.get('/:id', asyncHandler(async  (req, res) => {
    console.log(`looking for an individual book with id: ${req.params.id}`)
    const book = await Book.findByPk(req.params.id);
    if (book){
        console.log(`looking for book...`)
        res.render("books/update", { book, title: book.title });
    } else {
        // res.sendStatus(404);   // Automatically generated. not sure what this does
        const err = new Error();
        err.status = 404;
        throw err;        
    }
})); 

/* POST to UPDATE a book */
router.post('/:id', asyncHandler(async (req, res) => {
    console.log(`going to update a book..`)
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        console.log(`we want to update book id: ${book.id}`)
        if (book){
            // update the book object from the request body
            await book.update(req.body);
            // redirect back to the full book list
            res.redirect("/books");
        } else {
            const err = new Error();
            err.status = 404;
            throw err;
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {        // checking the error
            console.log(`we have the right error`)
            console.log(error.errors)
            book = await Book.build(req.body);
            console.log(book)
            console.log(`book.id: ${book.id}`)
            console.log(`req.params.id: ${req.params.id}`)
            book.id = req.params.id; // make sure correct book gets updated
            res.render("books/update", { book, errors: error.errors, title: "Update Book" })
        } else {
            throw error;    // error caught in the asyncHandler's catch block
        };
    }
}));

/* POST to DELETE the individual book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
    console.log(`gonna delete a book`)
    const book = await Book.findByPk(req.params.id);
    console.log(`going to delete id: ${book.id}`)
    if (book){
        await book.destroy();
        res.redirect("/books");
    } else {
        const err = new Error();
        err.status = 404;
        throw err; ;
    }
}));


module.exports = router;