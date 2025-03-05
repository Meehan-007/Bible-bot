import React from 'react';
import { useState } from "react";
import Form from 'react-bootstrap/esm/Form';


const Login = ({ phone }: { phone: string }) => {
    const booksOfTheBible = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1Samuel', '2Samuel',
        '1Kings', '2Kings', '1Chronicles', '2Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
        'Ecclesiastes', 'SongofSolomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
        'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
        'Mark', 'Luke', 'John', 'Acts', 'Romans', '1Corinthians', '2Corinthians', 'Galatians', 'Ephesians', 'Philippians',
        'Colossians', '1Thessalonians', '2Thessalonians', '1Timothy', '2Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
        '1Peter', '2Peter', '1John', '2John', '3John', 'Jude', 'Revelation'
    ];

    const [book, setBook] = useState('genesis');
    const [wholeBible, setWholeBible] = useState(false);
    const [OT, setOT] = useState(false);
    const [NT, setNT] = useState(false);
    const [url, setUrl] = useState('https://bible-api.com/data/web/random');



    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetId = event.target.id;

        console.log("targetId", targetId);

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
            setUrl('http://localhost:3001/api/random/' + targetId);
            console.log("URL:", url);
            setWholeBible(false);
            setOT(false);
            setNT(false);
        }

        // URL construction (example)


    }


    const update = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!wholeBible && !OT && !NT) {
            const response = await fetch('http://localhost:3001/api/random/' + book);
            console.log('Response:', response);
            const data = await response.json();

        }
        else {
            const response = await fetch(url);
            const data = await response.json();

        }
        try {
            phone = `+1${phone}`;
            console.log("phone", phone);
            console.log("URL! for update login", url);

            const response = await fetch('http://localhost:3001/login', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, phone }),
            })

            if (!response.ok) {
                const errorData = await response.json(); // Try to get error details from server
                throw new Error(`Login failed: ${response.status} - ${errorData?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log("data", data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const deleting = async () => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'DELETE',
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
            console.log("data", data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <Form onSubmit={update}>
                <Form.Group>

                    <div className="d-flex align-items-center px-4">
                        <Form.Check
                            className="w20 circle"
                            type="checkbox"
                            id="total"
                            label=""
                            checked={wholeBible}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> whole bible</Form.Label>

                    </div>
                </Form.Group>
                <Form.Group>
                    <div className="d-flex align-items-center px-4">

                        <Form.Check
                            type="checkbox"
                            className="w20 circle"
                            id="OT"
                            label=""
                            checked={OT}
                            onChange={(e) => handleCheckboxChange(e)} />
                        <Form.Label className="text-center label"> old testament only</Form.Label>
                    </div>
                </Form.Group>


                <Form.Group>
                    <div className="d-flex align-items-center px-4">

                        <Form.Check
                            type="checkbox"
                            className="w20 circle"
                            id="NT"
                            label=""
                            checked={NT}
                            onChange={(e) => handleCheckboxChange(e)}
                        />
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
                <button className="mt-4 px-4 py-2 bg-danger text-white col-12" type="button" onClick={deleting}> unsubscribe </button>
                <button className="mt-4 px-4 py-2 bg-primary text-white col-12" type="submit"> update </button>
            </Form>


        </div>
    );
}


export default Login;