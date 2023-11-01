'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          // custom error message
          msg: 'Please provide a value for title'
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          // custom error message
          msg: 'Please provide a value for author'
        },
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, { });      // DO WE NEED TO PASS SEQUELIZE as the second parameter? seems to work ok without it...


  // Book.associate = function(models) {
  //   // associations can be defined here
  // };
  return Book;
};