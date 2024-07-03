import React from 'react';
import './styles/ChatBot.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
    return (
        <div className="App">
            <ChatBot />
        </div>
    );
}

export default App;
