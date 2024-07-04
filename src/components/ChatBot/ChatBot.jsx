import React, { useState } from 'react';
import ChatBotContainer from './ChatBotContainer';
import { sendMessage } from '../../utils/api';
import "../../styles/ChatBot.css";
import { parse } from 'chrono-node';

function ChatBot() {
    const [messages, setMessages] = useState([{
        message: "Hi! I am your AI Assistant. Start speaking or type your request so that I can generate you a plan",
        sender: "ChatGPT",
        direction: "incoming",
        position: "single"
    }]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const results = parse(message);
        let messageToSend = message;

        if (results.length > 0) {
            const { start } = results[0];
            const date = start.date();
            const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            messageToSend = `Did you mean: ${formattedDate}? Please confirm.`;
        }

        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };
        const replyMessage = {
            message: messageToSend,
            direction: 'incoming',
            sender: "ChatGPT"
        };

        setMessages(prevMessages => [...prevMessages, newMessage, replyMessage]);
        setIsTyping(true);

        try {
            const apiRequestBody = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Generate a short simple plan." },
                    ...messages.map(msg => ({
                        role: msg.sender === "ChatGPT" ? "assistant" : "user",
                        content: msg.message
                    })),
                    { role: "user", content: message }
                ]
            };

            const response = await sendMessage(apiRequestBody);
            if (response.choices && response.choices.length > 0) {
                const finalReply = {
                    message: response.choices[0].message.content,
                    sender: "ChatGPT",
                    direction: "incoming"
                };
                setMessages(prevMessages => [...prevMessages, finalReply]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <ChatBotContainer
            messages={messages}
            isTyping={isTyping}
            handleSend={handleSend}
        />
    );
}

export default ChatBot;
