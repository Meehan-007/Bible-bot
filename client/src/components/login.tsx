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
    let [url, setUrl] = useState('https://bible-api.com/data/web/random');

    const baseUrl = process.env.BIBLE_API_URL || 'http://localhost:3001';

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetId = event.target.id;
        let newUrl = '';

        if (targetId === "total") {
            newUrl = 'https://bible-api.com/data/web/random';
            setUrl(newUrl);
            console.log("URL:", newUrl);  // Use the local variable instead of url state
            setWholeBible(true)
            setOT(false);
            setNT(false);
        } else if (targetId === "OT") {
            newUrl = 'https://bible-api.com/data/web/random/OT';
            setUrl(newUrl);
            setWholeBible(false);
            setOT(true);
            setNT(false);
        } else if (targetId === "NT") {
            newUrl = 'https://bible-api.com/data/web/random/NT';
            setUrl(newUrl);
            console.log("URL:", newUrl);
            setNT(true);
            setWholeBible(false);
            setOT(false);
        }
        console.log("URL:", newUrl);
    }


    const update = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(wholeBible, OT, NT)
        if (!wholeBible && !OT && !NT) {
            const newUrl = `${baseUrl}/api/random/${book}`;
            url = newUrl;
            const response = await fetch(url);
            console.log('Response: 1', response);
            const data = await response.json();
        }
        else {
            const response = await fetch(url);
            const data = await response.json();

        }
        try {
            phone = `+1${phone}`;
            console.log("phone", phone);
            console.log("URL! for update login 2", url);

            const response = await fetch(`${baseUrl}/login`, {
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

            // Add timeout before refresh
            await new Promise(resolve => setTimeout(resolve, 200000)); // 2 second delay
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    }

    const deleting = async () => {
        try {
            const response = await fetch(`${baseUrl}/login`, {
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

            // Add timeout before refresh
            // 2 second delay
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="container p-3">
            <Form onSubmit={update} className="d-flex flex-column gap-3">
                <h1 className="text-center mb-4">Login</h1>
                
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                        <Form.Group className="mb-3">
                            <div className="d-flex flex-column gap-2">
                                <Form.Check
                                    type="checkbox"
                                    className="checkbox-container"
                                    id="total"
                                    label=""
                                    checked={wholeBible}
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                                <Form.Label className="text-center">whole bible</Form.Label>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="d-flex flex-column gap-2">
                                <Form.Check
                                    type="checkbox"
                                    className="checkbox-container"
                                    id="OT"
                                    label=""
                                    checked={OT}
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                                <Form.Label className="text-center">old testament only</Form.Label>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="d-flex flex-column gap-2">
                                <Form.Check
                                    type="checkbox"
                                    className="checkbox-container"
                                    id="NT"
                                    label=""
                                    checked={NT}
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                                <Form.Label className="text-center">new testament only</Form.Label>
                            </div>
                        </Form.Group>

                        <div className="mb-3">
                            <label htmlFor="books" className="d-block mb-2">Select a Book:</label>
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

                        <div className="d-grid gap-2">
                            <button className="btn btn-danger" type="button" onClick={deleting}>
                                unsubscribe
                            </button>
                            <button className="btn btn-primary" type="submit">
                                update
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}


export default Login;