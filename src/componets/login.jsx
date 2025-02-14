
import { useState } from "react";
import Form from 'react-bootstrap/Form';

const Login = (phone) => {
 

    const [wholeBible, setWholeBible] = useState(false);
    const [OT, setOT] = useState(false);
    const [NT, setNT] = useState(false);
    let url = 'https://bible-api.com/data/web/random';
    
  

    const handleCheckboxChange = (event) => {
        const targetId = event.target.id;
        const isChecked = event.target.checked;

        if (targetId === "total") {
            setWholeBible(isChecked);
            setOT(false); // Uncheck other options
            setNT(false); // Uncheck other options
        } else if (targetId === "OT") {
            setOT(isChecked);
            setWholeBible(false); // Uncheck other options
            setNT(false); // Uncheck other options
        } else if (targetId === "NT") {
            setNT(isChecked);
            setWholeBible(false); // Uncheck other options
            setOT(false); // Uncheck other options
        }

        // URL construction (example)
       
        if (wholeBible) {
            // No changes to URL for whole bible
        } else if (OT) {
            url += '/OT';
        } else if (NT) {
            url += '/NT';
        }
    }
        console.log("URL:", url);
       const login = async () => { 
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
            if (data) {
                const response = await fetch('http://localhost:3001/login', {
                    method: 'UPDATE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone, url }),
                })
            }

            console.log("Login successful:", data);

        } catch (error) {
            console.error(error);
        }
        
        

    }
    return (
        <div>
            <Form onsubmit={login}>
                <Form.Group>

                    <div className="d-flex align-items-center">
                        <Form.Control
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

                        <Form.Control
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

                        <Form.Control
                            type="checkbox"
                            className="w20 circle"
                            id="NT"
                            label="random verse from the new testament"
                            checked={NT}
                            onChange={(e) => handleCheckboxChange(e)}
                        />
                        <Form.Label className="text-center label"> new testament only </Form.Label>
                    </div>
                </Form.Group>
                <button className=" mt-4 px-4 py-2 bg-primary text-white col-7" onClick={login}> update </button>
            </Form>


        </div>
    );
} 


export default Login;