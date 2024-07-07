import React, { useState } from 'react';
import { MessageList, Message, MessageInput, MessageSeparator, Avatar } from '@chatscope/chat-ui-kit-react';
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
                PlanWise AI: Your productivity ally, expertly scheduling events, crafting strategic plans, and actively assisting you in accomplishing tasks all day long.
            </div>
            <MessageList className="message-list">
                {messages.map((msg, index) => (
                    <Message key={index} model={{
                        message: msg.message,
                        direction: msg.direction,
                        position: msg.position,
                        sender: msg.sender,
                    }}>
                        {msg.sender === "ChatGPT" && (
                            <Avatar src={aiAssistantLogo} name="AI Assistant" />
                        )}
                    </Message>
                ))}
                {isTyping && <MessageSeparator>Typing...</MessageSeparator>}
                {approvedPlan && (
                    <MessageSeparator>
                        <button className="approve-button" onClick={handleApproval}>
                            Approve
                        </button>
                    </MessageSeparator>
                )}
            </MessageList>
            <MessageInput
                placeholder="Type your request here..."
                value={inputValue}
                onChange={handleChange}
                onSend={handleSendClick}
                showAttachmentButton={false}
            />
        </div>
    );
};

export default ChatBotContainer;
