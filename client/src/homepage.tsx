import React, { useState } from 'react';
import './index.css';
import "tailwindcss"; 
import SignUp from './components/signUp';
import Login from './components/login';
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
    const [errorMessage, setErrorMessage] = useState('');
    
    const create = () => {
        const url = 'https://bible-api.com/data/web/random';
        fetch(url)
            .then(response => response.json()) 
            .then(data => {
                setQuote(data.random_verse?.text || 'No quote found');
                setChapter(data.random_verse?.chapter || 'No chapter found');
                setVerse(data.random_verse?.verse || 'No verse found');
                setBook(data.random_verse?.book || 'No book found');
            })
            .catch(error => console.error(error)); 
    };
    
    const handleShowModal = (isSignup) => {
        if (!phone) {
            setErrorMessage('Please enter a phone number.');
            return;
        }
        setErrorMessage('');
        setIsSignup(isSignup);
        setShowModal(true);
    };
     
    return ( 
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to Bible Quotes</h1>
                <p className="text-lg text-center text-gray-600 mb-4">{quote}</p>
                <div className="text-gray-700 mb-4 text-center">
                    <span className="font-semibold">{book}</span> <span>{chapter}</span>:<span>{verse}</span>
                </div>
                <button className="w-full py-2 mb-4 bg-primary text-white text-gray-800 rounded-lg hover:bg-blue-300 transition duration-300" onClick={create}>Generate Bible Quote</button>
                <p className="text-sm text-gray-600 mb-2 text-center">Type your number with no dashes. Example: 4568903241</p>
                <input className="w-full py-2 mb-4 border rounded-lg px-3" placeholder="Phone number" onChange={e => setPhone(e.target.value)} />
                {errorMessage && <p className="text-red  --bs-danger --bs-red bs-red bs-danger redText text-center mb-4">{errorMessage}</p>}
                <button className="w-full py-2 mb-4 bg-primary text-white text-gray-800 rounded-lg hover:bg-blue-300 transition duration-300" onClick={() => handleShowModal(true)}>Sign Up</button>
                <input className="w-full py-2 mb-4 border rounded-lg px-3" placeholder="Phone login" onChange={e => setPhone(e.target.value)} />
                <button className="w-full py-2 bs-primary rounded-lg hover:bg-gray-700 transition duration-300" onClick={() => handleShowModal(false)}>Login</button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isSignup ? "Sign Up" : "Login"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isSignup ? <SignUp phone={phone} /> : <Login phone={phone} />}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Homepage;