# sql-library-manager
Learn more about the developer on <a href="https://www.linkedin.com/in/tamarabuilds/" target="_blank">LinkedIn</a>

Unit 08 project for the Full Stack JavaScript Techdegree. This is a web app to list, add, update and delete books to manage a fictional library with a SQLite database.

![Screenshot 2023-11-02 at 10 00 17 AM](https://github.com/tamarabuilds/sql-library-manager/assets/98510821/67ce339c-7eea-494d-a430-ac80fcb0caa9)


## How It's Made

Tech used: HTML, CSS, JavaScript, Node.js, Express, Pug, SQLite, and the SQL ORM Sequelize

Install my-project with npm

```bash
  npm install
  npm start
```

## Optimizations

 * Made sure all errors route to the Global Error Handler.
 * Logic is centrally located in the books route.
 * When no search results are found, a friendly message appears with a link back home.
 * Clean UI accounting for large screens.


## Lessons Learned

Picked up a bunch of skills including:
 * Setting up an express server
 * Adding true data persistence to projects.
 * How to implement, modify, interact, and maintain a local custom SQLite database.
 * Improved setting routes and middleware


## Extra Features

* Search field added to work off the following fields: Title, Author, Genre, Year
* Pagination was added to the books listing page.
* Structure, style and CSS were updated:
  * Updated font to Lexend to improve readability. Learn more: https://www.lexend.com/
  * A custom logo favicon was added as a little star.
  * Background image was update with no repeating and responds to page size changes.


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License

[MIT](https://choosealicense.com/licenses/mit/)
