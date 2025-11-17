const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    //   return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   // retourne tous les bouquins
//     res.status(200).json(books);
// });
//version utilisant les promesses 
public_users.get('/', async (req, res) => {
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books); 
            }, 1000); 
        });
    }

    try {
        const allBooks = await getBooks();
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres", error: err.message });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//    const urlIsbn = req.params.isbn;
//     const book = books[urlIsbn];  // récupère le livre
//     if (!book) {  // si le livre n'existe pas
//         return res.status(404).json({ message: "Livre non trouvé" });
//     }
//     res.status(200).json(book);
//  });
//
//version utilisant les promesses 
public_users.get('/isbn/:isbn', async function (req, res) {
    const getBook = (isbn) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = books[isbn];
                if (!book) {
                    reject(new Error("Livre non trouvé"));
                } else {
                    resolve(book);
                }
            }, 1000); 
        });
    }

    try {
        const bookIsbn = await getBook(req.params.isbn);
        res.status(200).json(bookIsbn);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     const authorParam = req.params.author.toLowerCase().trim();

//     const book = Object.values(books).filter(
//         book => book.author.toLowerCase().trim() === authorParam
//     );


//     if (book.length === 0) {  // si le livre n'existe pas
//         return res.status(404).json({ message: "Livre non trouvé" });
//     }

//     res.status(200).json(book);
// });
//version avec les promesses 
public_users.get('/author/:author', async function (req, res) {
    const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = Object.values(books).filter(
                    book => book.author.toLowerCase() === author.toLowerCase()
                );
                if (result.length === 0) {
                    reject(new Error("Livre non trouvé"));
                } else {
                    resolve(result);
                }
            }, 1000);
        });
    }

    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        res.status(200).json(booksByAuthor);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here
//     const title = req.params.title;
//     const book = Object.values(books).filter(book => book.title === title);
//     if (book.length === 0) {  // si le livre n'existe pas
//         return res.status(404).json({ message: "Livre non trouvé" });
//     }
//     res.status(200).json(book);
// });
//version avec les promesses 
public_users.get('/title/:title', async function (req, res) {
    const getBookByTitle = (title) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
                if (result.length === 0) {
                    reject(new Error("Livre non trouvé"));
                } else {
                    resolve(result);
                }
            }, 1000); 
        });
    }

    try {
        const booksByTitle = await getBookByTitle(req.params.title);
        res.status(200).json(booksByTitle);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn];

    if (!book) { 
        return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.status(200).json(book.reviews);
});



module.exports.general = public_users;
