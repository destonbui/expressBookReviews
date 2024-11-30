const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  //Missing info
  if (!username || !password) {
    return res.status(422).json({ message: "Missing credentials" });
  }

  //User already exist
  const isExisted = users.find((user) => user.username === username);

  if (isExisted) {
    return res.status(409).json({ message: "User already registered." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registed successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((booksData) => {
      // Once the promise resolves, send the response
      res.status(200).send(JSON.stringify(booksData, null, 4));
    })
    .catch((error) => {
      // If there's an error, send a failure response
      res
        .status(500)
        .send({ error: "An error occurred while fetching books." });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const result = books[isbn];

    if (result) {
      resolve(result);
    } else {
      reject("Book not found.");
    }
  })
    .then((resultData) => {
      return res.status(200).send(JSON.stringify(resultData, null, 4));
    })
    .catch((error) => {
      if (error === "Book not found.") {
        res.status(204).json({ message: error });
      } else {
        res.status(500).send({ error: error });
      }
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  // Simulating an asynchronous operation with a promise
  new Promise((resolve, reject) => {
    const authorBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    if (authorBooks.length > 0) {
      resolve(authorBooks); // Resolve the promise with the filtered books
    } else {
      reject("Can not find any books related to author."); // Reject if no books found
    }
  })
    .then((authorBooks) => {
      // If resolved, send the books in the response
      return res.status(200).send(JSON.stringify(authorBooks, null, 4));
    })
    .catch((error) => {
      // If rejected, send the error message
      return res.status(204).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const results = Object.values(books).filter((book) => book.title === title);

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  } else {
    return res
      .status(204)
      .json({ message: "Can not find any books with that title." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews));
  } else {
    return res.status(204).json({ message: "Can not find book by ISBN." });
  }
});

module.exports.general = public_users;
