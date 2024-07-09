import React from 'react';
import { MessageList, Message, MessageSeparator, Avatar } from '@chatscope/chat-ui-kit-react';
import aiAssistantLogo from '../../assets/images/ai_assistant.png';

const ChatBotMessages = ({ messages, isTyping, approvedPlan, handleApproval }) => (
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
);

export default ChatBotMessages;
