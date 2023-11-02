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
    // console.log(`GET full list of books - start`)
    // console.log(`req.query.search: ${req.query.search}`)
    // console.log(`req.query.page: ${req.query.page}`)
    const search = req.query.search || "";
    const pageNum = req.query.page || 1;
    const booksAll = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              // like is case insensitive in sqlite by default: https://sqlite.org/faq.html#q18
              [Op.like]: `%${search}%`,
            },
          },
          {
            author: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            genre: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            year: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
    });

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              // like is case insensitive in sqlite by default: https://sqlite.org/faq.html#q18
              [Op.like]: `%${search}%`,
            },
          },
          {
            author: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            genre: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            year: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      offset: ITEMS_PER_PAGE * (pageNum - 1),
      limit: ITEMS_PER_PAGE,
    });

    // Pagination
    const numberOfPages = Math.ceil(booksAll.length / ITEMS_PER_PAGE);
    // console.log(`numberOfPages: ${numberOfPages}`);
    // console.log(numberOfPages)
    res.render("books/index", {
      books,
      numberOfPages,
      pageNum,
      title: "Books",
    });
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
        // checking the error type
        book = await Book.build(req.body);
        res.render("books/new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
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
        res.render("books/update-book", {
          book,
          errors: error.errors,
          title: "Update Book",
        });
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
