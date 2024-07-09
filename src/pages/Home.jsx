import React from 'react';
import { Link } from 'react-router-dom';
function Home() {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is the main page of the application.</p>
                        <Link to="/chatbot" className="btn-link">
                Open ChatBot
            </Link>
        </div>
    );
}

export default Home;
