'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
      validate: {
        notNull: {
          // custom error message
          msg: 'Please provide a value for title'
        },
        notEmpty: {
          // custom error message
          msg: 'Please provide a value for title'
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
      validate: {
        notNull: {
          // custom error message
          msg: 'Please provide a value for author'
        },
        notEmpty: {
          // custom error message
          msg: 'Please provide a value for author'
        },
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};