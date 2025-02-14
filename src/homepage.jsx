import React, { useState } from 'react';
import './index.css';
import "tailwindcss"; 
import SignUp from './componets/signUp';
import Login from './componets/login';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Homepage = () => {
    const [showModal, setShowModal] = useState(false); 
    const [isSignup, setIsSignup] = useState(true);

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
    
    const handleShowModal = (isSignup) => {
        setIsSignup(isSignup); // Set whether it's signup or login modal
        setShowModal(true);

      
    };
     
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
                <button className=" mt-4 px-4 py-2 bg-primary text-white col-7" onClick={() => handleShowModal(true)}>signup</button>
                <input className="mt-4 px-4 py-2 bg-white col-7 border" placeholder="phone login" onChange={e => setPhone(e.target.value)}  />
                <button className=" mt-4 px-4 py-2 b col-7" onClick={() => handleShowModal(false)}>Login</button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isSignup ? "sign up" : "login"} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isSignup ? <SignUp phone={phone}/> : <Login phone={phone} />}
                </Modal.Body>
            </Modal>
        </div>


    );
}

export default Homepage