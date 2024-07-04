import React, { useState } from 'react';
import ChatBotContainer from '../ChatBotContainer/ChatBotContainer';
import { sendMessage } from '../../utils/api';
import "./ChatBot.css";
import { parse } from 'chrono-node';

function ChatBot() {
    const [messages, setMessages] = useState([{
        message: "Hi! I am your AI Assistant. Start speaking or type your request so that I can generate you a plan",
        sender: "ChatGPT",
        direction: "incoming",
        position: "single"
    }]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (inputMessage) => {
        setIsTyping(true);

        // Parse the message for dates
        const results = parse(inputMessage);
        let parsedMessage = inputMessage;

        if (results.length > 0) {
            const { start } = results[0];
            const date = start.date();
            const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            parsedMessage = `Did you mean: ${formattedDate}? Please confirm.`;
        }

        // Construct the user message to add to state
        const userMessage = {
            message: inputMessage,
            direction: 'outgoing',
            sender: "user"
        };

        // Add user message to state
        setMessages(prevMessages => [...prevMessages, userMessage]);

        // Prepare and send the API request
        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Generate a short simple plan." },
                ...messages.map(msg => ({
                    role: msg.sender === "ChatGPT" ? "assistant" : "user",
                    content: msg.message
                })),
                { role: "user", content: inputMessage }
            ]
        };

        try {
            const response = await sendMessage(apiRequestBody);
            let botMessages = [];

            // Construct the bot's parsed date message if applicable
            if (parsedMessage !== inputMessage) {
                const parseConfirmMessage = {
                    message: parsedMessage,
                    direction: 'incoming',
                    sender: "ChatGPT"
                };
                botMessages.push(parseConfirmMessage);
            }

            // Handle response from API
            if (response.choices && response.choices.length > 0) {
                const finalReply = {
                    message: response.choices[0].message.content,
                    direction: "incoming",
                    sender: "ChatGPT"
                };
                botMessages.push(finalReply);
            }

            // Add bot messages to state
            setMessages(prevMessages => [...prevMessages, ...botMessages]);
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
