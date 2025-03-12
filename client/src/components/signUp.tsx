import React from 'react';
import { useState, } from "react";
import Form from 'react-bootstrap/Form';


const SignUp = ({ phone }: { phone: string }) => {
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
    const [errorMessage, setErrorMessage] = useState('');

    const baseUrl = process.env.BIBLE_API_URL || 'http://localhost:3001';

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const targetId = event.target.id;


        if (targetId === "total") {
            setUrl('https://bible-api.com/data/web/random');
            console.log("URL:", url);
            setWholeBible(true)
            console.log("wholeBible", wholeBible);
            setOT(false); // Uncheck other options
            setNT(false); // Uncheck other options
        } else if (targetId === "OT") {

            setUrl('https://bible-api.com/data/web/random/OT');
            console.log("URL:", url);
            setOT(true);
            setWholeBible(false); // Uncheck other options
            setNT(false); // Uncheck other options

        } else if (targetId === "NT") {
            setUrl('https://bible-api.com/data/web/random/NT');
            console.log("URL:", url);
            setNT(true);
            console.log("NT", NT);
            setWholeBible(false); // Uncheck other options
            setOT(false); // Uncheck other options

        }
        else {
            
            setWholeBible(false);
            setOT(false);
            setNT(false);
        }


    }



    const signup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(''); // Clear previous error message

        try {
            if (!wholeBible && !OT && !NT) {
                altUrl = `${baseUrl}/api/random/${book}`;
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

            


            const response = await fetch(`${baseUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, url }),
            });

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
            window.location.reload();

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    }

    return (
        <div className="container p-3">
            <h1 className="text-center mb-4"> Sign Up</h1>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
                <div className="my-1">
                    <label htmlFor="books">Select a Book:</label>
                    <select
                        id="books"
                        name="books"
                        onChange={(e) => setBook(e.target.value)}
                    >
                        {booksOfTheBible.map((book, index) => (
                            <option key={index} value={book}>{book}</option>
                        ))}
                    </select>
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