import React from 'react';
import ChatBotHeader from './ChatBotHeader';
import ChatBotMessages from './ChatBotMessages';
import ChatBotInput from './ChatBotInput';
import "../../styles/ChatBot.css";

const ChatBotContainer = ({ messages, isTyping, handleSend, handleApproval, approvedPlan }) => (
    <div className="chat-container">
        <ChatBotHeader />
        <ChatBotMessages
            messages={messages}
            isTyping={isTyping}
            approvedPlan={approvedPlan}
            handleApproval={handleApproval}
        />
        <ChatBotInput handleSend={handleSend} />
    </div>
);

export default ChatBotContainer;
