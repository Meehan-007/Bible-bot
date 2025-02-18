

import { useState, } from "react";
import Form from 'react-bootstrap/Form';

const SignUp = ({ phone }) => { 
    const [wholeBible, setWholeBible] = useState(false);
    const [OT, setOT] = useState(false);
    const [NT, setNT] = useState(false);
    const [url, setUrl] = useState('');

    const handleCheckboxChange = (event) => {
        console.log("event", event);
        
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

     
        
        
       
        
    }
        const signup = async () => {
            
            console.log("URL!", url);
            phone = `+1${phone}`;
              console.log("phone", phone);
            try {
                const response = await fetch('http://localhost:3001/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone, url }),
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
        return (
            <div>
                <Form onsubmit={signup}>
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
                    <button className=" mt-4 px-4 py-2 bg-primary text-white col-12" onClick={signup}> create account </button>
                </Form>


            </div>
        );
    } 

    export default SignUp