import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import Home from './pages/Home.jsx';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatBot from './pages/ChatBot.jsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
