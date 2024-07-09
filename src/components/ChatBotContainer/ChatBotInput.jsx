import React, { useState } from 'react';
import { MessageInput } from '@chatscope/chat-ui-kit-react';

const ChatBotInput = ({ handleSend }) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (value) => {
        setInputValue(value);
    };

    const handleSendClick = () => {
        handleSend(inputValue);
        setInputValue("");
    };

    return (
        <MessageInput
            placeholder="Type your request here..."
            value={inputValue}
            onChange={handleChange}
            onSend={handleSendClick}
            showAttachmentButton={false}
        />
    );
};

export default ChatBotInput;
