// require('dotenv').config(); // Load environment variables
import fs from 'fs';
import path from 'path';
// import {book} from '../models/book.js';  // Path to your Sequelize models
import Sequelize from 'sequelize'; // Path to your db connection

async function seedDatabase() {
    try {
        const jsonDir = path.join(__dirname, './json'); // Path to your JSON files
        const bookData = {};

        const files = fs.readdirSync(jsonDir);

        for (const file of files) {
            if (path.extname(file) === '.json') {
                const bookName = path.basename(file, '.json');
                const filePath = path.join(jsonDir, file);
                const fileContents = fs.readFileSync(filePath, 'utf8');
                bookData[bookName] = JSON.parse(fileContents);
            }
        }

        await Sequelize.sync({ force: false }); // Sync database (use force: false in production)

        // Seed the database:
        for (const book in bookData) {
            const chapters = bookData[book];
            const createdBook = await Book.create({ name: book });

            for (const chapterNumber in chapters) {
                const verses = chapters[chapterNumber];
                const createdChapter = await Chapter.create({
                    bookId: createdBook.id,
                    number: chapterNumber
                });

                for (const verseText of verses) {
                    await Verse.create({
                        chapterId: createdChapter.id,
                        text: verseText
                    });
                }
            }
        }

        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();