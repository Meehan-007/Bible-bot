const express = require('express');
const app = express.Router();

// Import all your JSON files.  A better approach would be to dynamically load these.
const books = {
    "1chronicles": require('../json/1chronicles.json'),
    "1corinthians": require('../json/1corinthians.json'),
    "1john": require('../json/1john.json'),
    "1kings": require('../json/1kings.json'),
    "1peter": require('../json/1peter.json'),
    "1samuel": require('../json/1samuel.json'),
    "1thessalonians": require('../json/1thessalonians.json'),
    "1timothy": require('../json/1timothy.json'),
    "2chronicles": require('../json/2chronicles.json'),
    "2corinthians": require('../json/2corinthians.json'),
    "2john": require('../json/2john.json'),
    "2kings": require('../json/2kings.json'),
    "2peter": require('../json/2peter.json'),
    "2samuel": require('../json/2samuel.json'),
    "2thessalonians": require('../json/2thessalonians.json'),
    "2timothy": require('../json/2timothy.json'),
    "3chronicles": require('../json/3chronicles.json'),
    "3john": require('../json/3john.json'),
    "3peter": require('../json/3peter.json'),
    "4john": require('../json/4john.json'),
    "4peter": require('../json/4peter.json'),
    "4chronicles": require('../json/4chronicles.json'),
    "5john": require('../json/5john.json'),
    "5peter": require('../json/5peter.json'),
    "5chronicles": require('../json/5chronicles.json'),
    "6john": require('../json/6john.json'),
    "6peter": require('../json/6peter.json'),
};

function findById(id, animalsArray) {
    const result = booksArray.filter(chapters => chapter === id)[0];
    return result;
  }
app.get("/random/:book", async (req, res) => {
    try {
        const { book } = req.params;
        const bookData = books[book.toLowerCase()]; // Case-insensitive lookup

        if (!bookData) {
            return res.status(404).json({ error: "Book not found." });
        }

        // Get all chapter numbers.  Assumes your JSON is structured with chapters as keys.
        const chapterNumbers = Object.keys(bookData);

        if (chapterNumbers.length === 0) {
            return res.status(404).json({ error: "No chapters found in this book." });
        }

        const randomChapter = chapterNumbers[Math.floor(Math.random() * chapterNumbers.length)];
        const chapterVerses = bookData[randomChapter]; // Get the verses for the random chapter

        if (!chapterVerses || chapterVerses.length === 0) {
            return res.status(404).json({ error: "No verses found in this chapter." });
        }

        const numVersesToReturn = Math.floor(Math.random() * 4) + 3; // 3 to 10 verses
        const randomVerses = [];

        //Efficiently get random verses without duplicates
        const indices = new Set();
        while (indices.size < Math.min(numVersesToReturn, chapterVerses.length)){
            indices.add(Math.floor(Math.random() * chapterVerses.length));
        }

        for (const index of indices){
            randomVerses.push(chapterVerses[index]);
        }


        res.json({
            book,
            chapter: randomChapter,
            verses: randomVerses
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = app;