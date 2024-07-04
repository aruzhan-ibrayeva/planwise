import React from 'react';
import './components/ChatBot/ChatBot.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatBot from './components/ChatBot/ChatBot.jsx';

function App() {
    return (
        <div className="App">
            <ChatBot />
        </div>
    );
}

export default App;
