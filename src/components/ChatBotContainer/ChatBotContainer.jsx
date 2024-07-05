import React, { useState } from 'react';
import { MessageList, Message, MessageInput, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import aiAssistantLogo from '../../assets/images/ai_assistant.png';

const ChatBotContainer = ({ messages, isTyping, handleSend, handleApproval, approvedPlan }) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (value) => {
        setInputValue(value);
    };

    const handleSendClick = () => {
        handleSend(inputValue);
        setInputValue("");
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <img src="aiAssistantLogo" alt="Avatar" class="chat-avatar"/>
                PlanWise AI generates an efficient plan, prioritizes and timeblocks your tasks on your calendar, and helps you achieve your tasks throughout the day
            </div>
            <MessageList className="message-list">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <Message
                            model={{
                                message: msg.message,
                                direction: msg.direction,
                                position: msg.position
                            }}
                            avatar={aiAssistantLogo}
                        />
                        {approvedPlan && msg.direction === "incoming" && (
                            <MessageSeparator>
                                <button className="approve-button" onClick={handleApproval}>
                                    Approve
                                </button>
                            </MessageSeparator>
                        )}
                    </div>
                ))}
                {isTyping && <MessageSeparator>Typing...</MessageSeparator>}
            </MessageList>
            <MessageInput
                placeholder="Type your request here..."
                value={inputValue}
                onChange={handleChange}
                onSend={handleSendClick}
            />
        </div>
    );
};

export default ChatBotContainer;
