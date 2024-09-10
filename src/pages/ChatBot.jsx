import React, { useState } from 'react';
import ChatBotContainer from '../components/ChatBotContainer/ChatBotContainer';
import { sendMessage } from '../api/gpt';
import { createEvent } from '../api/index';
import { parse } from 'chrono-node';
import "../styles/ChatBot.css";

function ChatBot() {
    const initialMessage = {
        message: "Hi! I am your AI Assistant. Start speaking or type your request so that I can generate you a plan",
        sender: "ChatGPT",
        direction: "incoming",
        position: "single"
    };

    const [messages, setMessages] = useState([initialMessage]);
    const [isTyping, setIsTyping] = useState(false);
    const [approvedPlan, setApprovedPlan] = useState(null);

    const formatMessageWithDate = (inputMessage) => {
        const results = parse(inputMessage);
        if (results.length > 0) {
            const { start } = results[0];
            const date = start.date();
            return `${inputMessage} (${date.toLocaleDateString()} at ${date.toLocaleTimeString()})`;
        }
        return inputMessage;
    };

    const handleSend = async (inputMessage) => {
        setIsTyping(true);

        const formattedMessage = formatMessageWithDate(inputMessage);

        const userMessage = {
            message: inputMessage,
            direction: 'outgoing',
            sender: "user"
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);

        const apiRequestBody = {
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                {
                    "role": "system",
                    "content": "You are an AI assistant. This is 2024 year. I am in Almaty. Your tasks are as follows: 1. Schedule an event. You may ask clarifying questions if needed. Once I approve the event, format the details into a JSON file suitable for Google Calendar.  Indicate the approval with the JSON file by displaying an 'Approve' button in the front."
                }
                ,
                ...messages.map(msg => ({
                    role: msg.sender === "ChatGPT" ? "assistant" : "user",
                    content: msg.message
                })),
                { role: "user", content: formattedMessage }
            ]
        };

        try {
            const response = await sendMessage(apiRequestBody);
            handleApiResponse(response);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleApiResponse = (response) => {
        const botMessages = [];
        if (response.choices && response.choices.length > 0) {
            const finalReply = {
                message: response.choices[0].message.content,
                direction: "incoming",
                sender: "ChatGPT"
            };
            botMessages.push(finalReply);

            const jsonStartIndex = response.choices[0].message.content.indexOf('```json');
            const jsonEndIndex = response.choices[0].message.content.lastIndexOf('```');
            if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
                const jsonString = response.choices[0].message.content.substring(jsonStartIndex + 7, jsonEndIndex);
                try {
                    const jsonData = JSON.parse(jsonString);

                    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    if (jsonData.start && jsonData.end) {
                        jsonData.start.timeZone = timeZone;
                        jsonData.end.timeZone = timeZone;
                    }

                    console.log("Approved Plan JSON Data:", JSON.stringify(jsonData, null, 2));
                    setApprovedPlan(jsonData);
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                }
            } else {
                setApprovedPlan(null);
            }
        }

        setMessages(prevMessages => [...prevMessages, ...botMessages]);
    };

    const handleApproval = async () => {
        if (approvedPlan) {
            try {
                console.log("Adding your approved plan:", JSON.stringify(approvedPlan, null, 2));
                const response = await createEvent(approvedPlan);
                console.log("Plan approved and sent to backend:", response);
                setMessages(prevMessages => [...prevMessages, {
                    message: "Event was scheduled in your Google Calendar!",
                    direction: "incoming",
                    sender: "ChatGPT"
                }]);
                setApprovedPlan(null);
            } catch (error) {
                console.error("Failed to send plan to backend:", error);
            }
        }
    };

    return (
        <div>
            <ChatBotContainer
                messages={messages}
                isTyping={isTyping}
                handleSend={handleSend}
                handleApproval={handleApproval}
                approvedPlan={approvedPlan}
            />
        </div>
    );
}

export default ChatBot;
