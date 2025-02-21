import express from 'express';
const router = express.Router();

router.get("/random/:book", async (req, res) => {
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

export default router;