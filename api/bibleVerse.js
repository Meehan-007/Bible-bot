import express from 'express';
const router = express.Router();

router.get("/random/:book", async (req, res) => {
    try {
        const { book } = req.params;
        console.log("book name", book);
        const results = await '../seed/' + book + '.json';
        console.log("results", results);

        let maxChapter = -Infinity;
        let maxVerse = -Infinity;

       for(const chapter in results){
        console.log("chapter", chapter);
           if(chapter > maxChapter){
               maxChapter = chapter;
               console.log("maxChapter", maxChapter);
               console.log("chapter2", chapter);
           }
        }
          const chapterSelection = Math.floor(Math.random() * maxChapter);
           console.log("maxChapter2", maxChapter);
           console.log("chapterSelection", chapterSelection);
           for(const verse in results[chapterSelection]){
               if(verse > maxVerse){
                   maxVerse = verse;
               }
           }
          const verseSelection = Math.floor(Math.random() * maxVerse);
           console.log("maxVerse", maxVerse);

           const finalVerse = results[chapterSelection][verseSelection];
           console.log("finalVerse", finalVerse);

       
} catch (err) {
        console.error("Error getting random verse:", err);
        res.status(500).json({ error: "Failed to get random verse", details: err.message });
    }
});

export default router;