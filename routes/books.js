const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const { Op } = require("sequelize");
const ITEMS_PER_PAGE = 10;

/**
 * Handler function to wrap each route with. Reduces try.. catch blocks.
 * @param {function} cb
 * @returns callback
 */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

/* GET error route to throw 500 server error for testing */
router.get("/error", (req, res, next) => {
  console.log(`Custom error route called`);
  const err = new Error(`Custom 500 error message. Please try another page.`);
  err.status = 500;
  throw err;
});

/* GET list of books */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = req.query.search || "";
    const pageNum = req.query.page || 1;
    console.log(req.query.page)
    let books = await Book.findAll({
      where: {
        [Op.or]: [
          // like is case insensitive in sqlite by default: https://sqlite.org/faq.html#q18
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { genre: { [Op.like]: `%${search}%` } },
          { year: { [Op.like]: `%${search}%` } },
        ]
      }
    });

    // Pagination
    const numberOfPages = Math.ceil(books.length / ITEMS_PER_PAGE);

    // If a page is selected, only return the slice of books for that number of items per page.
    req.query.page
      ? (books = books.slice(
          ((req.query.page * ITEMS_PER_PAGE) - ITEMS_PER_PAGE), (req.query.page * ITEMS_PER_PAGE)
      ))
      : (books = books.slice(0, ITEMS_PER_PAGE))

    res.render("books/index", { books, numberOfPages, pageNum, search, title: "Books" });
  })
);

/* Create a new book form */
router.get("/new-book", (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create a new book */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    // new book varible
    let book;
    try {
      // set book variable to the Book model, created with the request body data
      book = await Book.create(req.body);
      // redirect back to the full book list
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("books/new-book", { book, errors: error.errors, title: "New Book" });
      } else {
        throw error;
      }
    }
  })
);

/* GET individual book */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/update-book", { book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      throw err;
    }
  })
);

/* POST to UPDATE a book */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
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
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        book.id = req.params.id; // make sure correct book gets updated
        res.render("books/update-book", { book, errors: error.errors, title: "Update Book" });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

/* POST to DELETE the individual book */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      const err = new Error();
      err.status = 404;
      throw err;
    }
  })
);

module.exports = router;
