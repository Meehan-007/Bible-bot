import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get("/random/:book", async (req, res) => {
    try {
        const { book } = req.params;
        console.log("book name", book);
        if (!book) {
            return res.status(400).json({ error: "Book parameter is required" });
        }
        const filePath = path.resolve(__dirname, '..', 'seed', `${book}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const results = JSON.parse(fileContent);
        
        var key = Math.floor(Math.random() * results.length);
        if (key > results.length - 6) {
            key = results.length - 6;
        }
        let final: (string | any)[] = [];
        for(var i = key; i < key + 6; i++) {
            console.log("", results[i]);
            final.push("final", results[i]);
        }
        
        res.json({ final });
        
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error getting random verse:", err);
            res.status(500).json({ error: "Failed to get random verse", details: err.message });
        } else {
            console.error("Unexpected error:", err);
            res.status(500).json({ error: "Failed to get random verse", details: "An unexpected error occurred." });
        }
    }
});

export default router;