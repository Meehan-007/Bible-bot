import React from 'react';
import { useState, } from "react";
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';


const SignUp = ({ phone, onHide }: { phone: string; onHide: () => void }) => {
    const booksOfTheBible = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1Samuel', '2Samuel',
        '1Kings', '2Kings', '1Chronicles', '2Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
        'Ecclesiastes', 'SongOfSolomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
        'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
        'Mark', 'Luke', 'John', 'Acts', 'Romans', '1Corinthians', '2Corinthians', 'Galatians', 'Ephesians', 'Philippians',
        'Colossians', '1Thessalonians', '2Thessalonians', '1Timothy', '2Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
        '1Peter', '2Peter', '1John', '2John', '3John', 'Jude', 'Revelation'
    ];


    const [book, setBook] = useState('genesis');
    const [wholeBible, setWholeBible] = useState(false);
    const [OT, setOT] = useState(false);
    const [NT, setNT] = useState(false);
    let [url , setUrl] = useState('');
    let altUrl
    const [isUpdated, setIsUpdated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const VITE_API_URL = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3001';
    

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetId = event.target.id;

        if (targetId === "total") {
            // Toggle wholeBible
            if (wholeBible) {
                setWholeBible(false);
                setUrl('');
            } else {
                setUrl('https://bible-api.com/data/web/random');
                setWholeBible(true);
                setOT(false);
                setNT(false);
            }
        } else if (targetId === "OT") {
            // Toggle OT
            if (OT) {
                setOT(false);
                setUrl('');
            } else {
                setUrl('https://bible-api.com/data/web/random/OT');
                setOT(true);
                setWholeBible(false);
                setNT(false);
            }
        } else if (targetId === "NT") {
            // Toggle NT
            if (NT) {
                setNT(false);
                setUrl('');
            } else {
                setUrl('https://bible-api.com/data/web/random/NT');
                setNT(true);
                setWholeBible(false);
                setOT(false);
            }
        }
    }



    const signup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        const form = event.target as HTMLFormElement;
        const agree = form.agree.checked;
        
        try {
            // Log the URL we're trying to use
            console.log("Base URL:", VITE_API_URL);
            console.log("Full signup URL:", `${VITE_API_URL}/signup`);

            if (!wholeBible && !OT && !NT) {
                altUrl = `${VITE_API_URL}/api/random/${book}`;
                console.log("URL!", altUrl);
                url = altUrl;
                const response = await fetch(url);
                console.log('Response:', response);
                const data = await response.json();
                

            }
            else {
                const response = await fetch(url);
                const data = await response.json();




            }

            const response = await fetch(`${VITE_API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, url }),
            });

            console.log('Signup Response:', response);

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData && typeof errorData.error === 'string' 
                    ? errorData.error 
                    : 'Signup failed. Please try again.';
                setErrorMessage(errorMessage);
                throw new Error(`Signup failed: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();
            console.log("Signup successful:", data);
            

            if (agree) {
                setIsUpdated(true);
                setSuccessMessage('Successfully signed up!');
                setTimeout(() => {
                    onHide();
                }, 1000); 
            }
            else {
                setErrorMessage('You must agree to receive messages from Bible Bot each day.');
            }

        } catch (error: unknown) {
            console.error(error);
            setIsUpdated(false);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    }

    return (
        <div className="container p-3">
            <h1 className="text-center mb-4">Sign Up</h1>
            {successMessage && (
                <Alert variant="success" className="text-center">
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert variant="danger" className="text-center">
                    {errorMessage}
                </Alert>
            )}
            <Form  onSubmit={signup} className="d-flex flex-column align-items-flex-start">
                <Form.Group >

                    <div className="d-flex align-items-center">
                        <Form.Check
                            className=""
                            type="checkbox"
                            id="total"
                            label=""
                            checked={wholeBible}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> whole bible</Form.Label>

                    </div>
                </Form.Group>
                <Form.Group className="my-1">
                    <div className="d-flex align-items-center">

                        <Form.Check
                            type="checkbox"
                            className=""
                            id="OT" 
                            data-testid="old testament only"
                            label=""
                            checked={OT}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> old testament only</Form.Label>
                    </div>
                </Form.Group>


                <Form.Group>
                    <div className="d-flex align-items-center">

                        <Form.Check
                            type="checkbox"
                            className=""
                            id="NT"
                            data-testid="new testament only"
                            label=""
                            checked={NT}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> new testament only </Form.Label>
                    </div>
                </Form.Group>
                <div className="d-flex align-items-center justify-content-center">
                    <hr className=" my-4 col-4"/> <p className='mx-2 text-center' style={{marginBottom: 0}}> Or </p> <hr className=" my-4 col-4"/>
                </div>
                <div className="my-1 mb-4">
                    <label htmlFor="books" className='mb-2'>Select a Book:</label>
                    <select
                        id="books"
                        name="books"
                        className="form-select"
                        onChange={(e) => setBook(e.target.value)}
                    >
                        {booksOfTheBible.map((book, index) => (
                            <option key={index} value={book}>{book}</option>
                        ))}
                    </select>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <Form.Check
                        type="checkbox"
                        className="checkbox-container"
                        id="agree"
                        label=""
                        required
                    />
                    <p style={{marginBottom: '0px'}}> I agree to receive messages from Bible Bot each day. 
                        Data rates may apply, reply STOP to opt out. 
                    </p>
                </div>
                <button 
                    className="mt-4 px-4 py-2 bg-primary text-white col-12" 
                    type="submit"
                > 
                    create account 
                </button>
            </Form>


        </div>
    );
}

export default SignUp