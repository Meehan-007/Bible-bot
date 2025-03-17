import React from 'react';
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';

const Login = ({ phone, onHide }: { phone: string; onHide: () => void }) => {
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
    const [isUpdated, setIsUpdated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const API_URL = import.meta.env.PROD 
        ? 'VITE_API_URL'
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




    const update = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        console.log(wholeBible, OT, NT)
        if (!wholeBible && !OT && !NT) {
            const newUrl = `${API_URL}/api/random/${book}`;
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



            const response = await fetch(`${API_URL}/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, phone }),
            })

            if (!response.ok) { console.log('Response: 2', fail);
                const errorData = await response.json(); //
                const errorMessage = errorData && typeof errorData.error === 'string'
                    ? errorData.error
                    : 'login failed. Please try again.';
                setErrorMessage(errorMessage);
                throw new Error(`Login failed: ${response.status} - ${errorData?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log("data", data);
            setSuccessMessage('Successfully updated!');
            setIsUpdated(true);

            setTimeout(() => {

                onHide();
            }, 500); // 2 second delay

        } catch (error) {
            console.error(error);
            setIsUpdated(false);
        }
    }

    const deleting = async () => {
        setSuccessMessage('');
        try {
            const response = await fetch(`${API_URL}/login`, {
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
            setIsUpdated(true);
            setSuccessMessage('Successfully unsubscribed!');
            setTimeout(() => {
                onHide();
            }, 1000);


        } catch (error) {
            console.error(error);
            setIsUpdated(false);
        }
    }
    return (
        <div className="container p-3">
            <Form onSubmit={update} className="d-flex flex-column gap-3">
                <h1 className="text-center mb-4">Login</h1>
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
                <div className="row">
                    <div className="col-12 mx-auto">
                        <Form.Group className="">
                            <div className="d-flex my-2">
                                <Form.Check
                                    type="checkbox"
                                    className="checkbox-container"
                                    id="total"
                                    data-testid="whole bible"
                                    label=""
                                    checked={wholeBible}
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                                <Form.Label className="text-center">whole bible</Form.Label>
                            </div>
                        </Form.Group>

                        <Form.Group >
                            <div className="d-flex my-2">
                                <Form.Check
                                    type="checkbox"
                                    className="checkbox-container"
                                    id="OT"
                                    data-testid="old testament only"
                                    label=""
                                    checked={OT}
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                                <Form.Label className="text-center">old testament only</Form.Label>
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <div className="d-flex my-2">
                                <Form.Check
                                    type="checkbox"
                                    className="checkbox-container"
                                    id="NT"
                                    data-testid="new testament only"
                                    label=""
                                    checked={NT}
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                                <Form.Label className="text-center">new testament only</Form.Label>
                            </div>
                        </Form.Group>
                        <div className="d-flex align-items-center justify-content-center">
                            <hr className=" my-4 col-4" /> <p className='mx-2 text-center' style={{ marginBottom: 0 }}> Or </p> <hr className=" my-4 col-4" />
                        </div>
                        <div className="my-1 mb-4">
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
                            <button className="btn btn-danger mt-2" type="button" onClick={deleting}>
                                unsubscribe
                            </button>
                            {!isUpdated && (
                                <button
                                    className="px-4 py-2 bg-primary text-white col-12"
                                    type="submit"
                                >
                                    update
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}


export default Login;