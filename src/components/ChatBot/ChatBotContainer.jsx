import React from 'react';
import { MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import aiAssistantLogo from '../../assets/images/ai_assistant.png';

const ChatBotContainer = ({ messages, isTyping, handleSend }) => (
    <div className="chat-container">
        <div className="chat-header">
            PlanWise AI generates an efficient plan, prioritizes and timeblocks your tasks on your calendar, and helps you achieve your tasks throughout the day
        </div>
        <MessageList className="message-list">
            {messages.map((msg, index) => (
                <Message 
                    key={index} 
                    model={{
                        message: msg.message,
                        direction: msg.direction,
                        position: msg.position
                    }} 
                    avatar={aiAssistantLogo}
                />
            ))}
        </MessageList>
        <MessageInput placeholder="Create a plan for exam preparation..." onSend={handleSend} />
    </div>
);

export default ChatBotContainer;
