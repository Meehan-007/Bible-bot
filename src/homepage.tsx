import React, { useState } from 'react';
import './index.css';
import "tailwindcss"; 

const Homepage = () => {
    const [verse, setVerse] = useState();
    const [chapter, setChapter] = useState();
    const [quote, setQuote] = useState(''); 
    const [book, setBook] = useState('');
    const create = () => {
        fetch('https://bible-api.com/data/web/random')
            .then(response => response.json()) 
            .then(data => {
                console.log(data.random_verse.text, "new one", data);
                
                // Return the data for the next .then()
               
           
            setQuote(data.random_verse?.text || 'No quote found');
             setChapter(data.random_verse?.chapter || 'No chapter found');
             setVerse(data.random_verse?.verse || 'No verse found');
            setBook(data.random_verse?.book || 'No book found');
        }) .catch(error => console.error(error)); 
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100" style={{ textAlign: 'center', padding: '20px' }}>
            <h1 className="text-3xl font-bold text-blue-600">Welcome to Bible Quotes</h1> 
            <span> {quote} </span>
            <div> 
            <span> {book}</span>
            <span> {chapter} </span>
            <span>: {verse}</span>
            </div>
            <div>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" onClick={create}> generate bible quote </button>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" onClick={create}> generate bible quote </button>
            </div>
        </div>
    );
};

export default Homepage;