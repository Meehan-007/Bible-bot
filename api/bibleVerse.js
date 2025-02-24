import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get("/random/:book", async (req, res) => {
    try {
        const { book } = req.params;
        console.log("book name", book);
        if (!book) {
            return res.status(400).json({ error: "Book parameter is required" });
        }
        const filePath = path.join(__dirname, '../seed', `${book}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const results = JSON.parse(fileContent);
        

        var key = Math.floor(Math.random( ) * results.length); 
        if (key > results.length - 6) {
            key = results.length - 6;
        }
        let final = [];
        for(var i = key; i < key + 6; i++) {
           
            
            
                console.log(results[i]);
                final.push(results[i]);
               
        }
        res.json({ final });
        
    }
        
        
 catch (err) {
        console.error("Error getting random verse:", err);
        res.status(500).json({ error: "Failed to get random verse", details: err.message });
    }
});

export default router;