import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

// Method 1: Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define possible paths where Bible verse files might be found
const possiblePaths = [
  path.join(__dirname, '../data'),
  path.join(process.cwd(), 'seed'),
  path.join(process.cwd(), 'data'),
  path.join(process.cwd(), 'backEnd/seed')
];

router.get("/random/:book", async (req, res) => {
    try {
        const book = req.params.book.toLowerCase();
        console.log("book name", book);
        if (!book) {
            return res.status(400).json({ error: "Book parameter is required" });
        }
        
        // Try each possible path and filename variation
        let filePath = '';
        let fileContent = null;
        
        for (const basePath of possiblePaths) {
            const testPath = path.join(basePath, `${book}.json`);
            console.log("testPath", testPath);
            try {
                if (fs.existsSync(testPath)) {
                    filePath = testPath;
                    console.log("filePath", filePath);
                    break;
                }
            } catch (err) {
                // Continue to next path
            }
        }
        
        if (!filePath) {
            return res.status(404).json({ error: `Bible book file not found: ${book}.json` });
        }
        
        fileContent = fs.readFileSync(filePath, 'utf-8');
        const results = JSON.parse(fileContent);
        
        var key = Math.floor(Math.random() * results.length);
        if (key > results.length - 6) {
            key = results.length - 6;
        }
        let final: (string | any)[] = [];
        for(var i = key; i < key + 6; i++) {
            console.log("", results[i]);
            final.push(results[i]);
        }
        console.log("final", final);
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