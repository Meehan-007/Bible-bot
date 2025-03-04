import React from 'react';
import { useEffect, useState, } from "react";
import Form from 'react-bootstrap/esm/Form';


const SignUp = ({ phone }) => {
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
    let [url, setUrl] = useState('');
    let altUrl
    const [errorMessage, setErrorMessage] = useState('');




    const handleCheckboxChange = (event) => {

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
            console.log("drop-down");
            setWholeBible(false);
            setOT(false);
            setNT(false);
        }


    }



    const signup = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Clear previous error message

        try {
            if (!wholeBible && !OT && !NT) {
                altUrl = ('http://localhost:3001/api/random/' + book);
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

            phone = `+1${phone}`;


            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, url }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Try to get error details from server
                setErrorMessage(errorData?.error || 'Signup failed. Please try again.'); // Set error message
                throw new Error(`Signup failed: ${response.status} - ${errorData?.error || response.statusText}`);
            }

            const data = await response.json();
            console.log("Signup successful:", data);
            window.location.reload();

        } catch (error) {
            console.error(error);
            // Optionally set the error message here as well
            setErrorMessage(error.message);
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Form onSubmit={signup}>
                <Form.Group>

                    <div className="d-flex align-items-center">
                        <Form.Check
                            className="w20 circle"
                            type="checkbox"
                            id="total"
                            label="random verse from the whole bible"
                            checked={wholeBible}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> whole bible</Form.Label>

                    </div>
                </Form.Group>
                <Form.Group>
                    <div className="d-flex align-items-center">

                        <Form.Check
                            type="checkbox"
                            className="w20 circle"
                            id="OT"
                            label="random verse from the old testament"
                            checked={OT}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> old testament only</Form.Label>
                    </div>
                </Form.Group>


                <Form.Group>
                    <div className="d-flex align-items-center">

                        <Form.Check
                            type="checkbox"
                            className="w20 circle"
                            id="NT"
                            label="random verse from the new testament"
                            checked={NT}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> new testament only </Form.Label>
                    </div>
                </Form.Group>
                <div>
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
                <button className=" mt-4 px-4 py-2 bg-primary text-white col-12" onClick={signup}> create account </button>
            </Form>


        </div>
    );
}

export default SignUp