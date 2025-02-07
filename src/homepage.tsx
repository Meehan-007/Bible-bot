import React, { useState } from 'react';

const Homepage = () => {
    const create = () => {
        fetch('https://bible-api.com/data/web/random/')
            .then(response => response.json) 
            .then(data => console.log(data))
            .catch(error => console.error(error));  
    }
    
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to Bible Quotes</h1>
            <span>  </span>
            <div>
                <button onClick={create}> generate bible quote </button>
            </div>
        </div>
    );
};

export default Homepage;