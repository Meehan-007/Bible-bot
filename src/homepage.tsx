import React, { useState } from 'react';
import './index.css';
import "tailwindcss"; 

const Homepage = () => {
    const [verse, setVerse] = useState('');
    const [chapter, setChapter] = useState('');
    const [quote, setQuote] = useState(''); 
    const [book, setBook] = useState(''); 
    const [phone, setPhone] = useState(''); 
    
    
    const create = () => {
        const url = 'https://bible-api.com/data/web/random';
        fetch(url)
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
    const login = async () => {
        console.log("phone", phone);
        ;
       
        try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        })

        if (!response.ok) {
            const errorData = await response.json(); // Try to get error details from server
            throw new Error(`Login failed: ${response.status} - ${errorData?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("Login successful:", data); 

    } catch (error) {
        console.error(error);
    }
    }
     const signup = () => { 
        
        const url = 'https://bible-api.com/data/web/random';
         const user = { phone: phone, url: url };
         

         fetch('http://localhost:3001/signup', 
             {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                },
                 body: JSON.stringify({ user }),
             })
    
         }
     
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100" style={{ textAlign: 'center', padding: '20px' }}>
            <h1 className="text-3xl font-bold text-blue-600">Welcome to Bible Quotes</h1> 
            <span> {quote} </span>
            <div> 
            <span> {book}</span>
            <span> {chapter} </span>
            <span> { ": " + verse}</span>
            </div>
            <div className='container col-8 d-flex flex-column align-items-center'>
                <button className=" mt-4 px-4 py-2 bg-white text-primary col-7 border border-primary" onClick={create}> generate bible quote </button>
                <input className="mt-4 px-4 py-2 bg-white col-7 border" placeholder="phone number" onChange={e => setPhone(e.target.value)} />
                <button className=" mt-4 px-4 py-2 bg-primary text-white col-7" onClick={signup}>signup</button>
                <input className="mt-4 px-4 py-2 bg-white col-7 border" placeholder="phone login" onChange={e => setPhone(e.target.value)}  />
                <button className=" mt-4 px-4 py-2 b col-7" onClick={login}>Login</button>
            </div>
        </div>
    );
}

export default Homepage