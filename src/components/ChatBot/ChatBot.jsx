import React, { useState } from 'react';
import ChatBotContainer from '../ChatBotContainer/ChatBotContainer';
import { sendMessage } from '../../utils/api';
import { createEvent } from '../../api/index';
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
    const [approvedPlan, setApprovedPlan] = useState(null);

    const handleSend = async (inputMessage) => {
        setIsTyping(true);

        let parsedMessage = inputMessage;

        const results = parse(inputMessage);
        if (results.length > 0) {
            const { start } = results[0];
            const date = start.date();
            const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            parsedMessage = `Did you mean: ${formattedDate}? Please confirm.`;
        }

        const userMessage = {
            message: inputMessage,
            direction: 'outgoing',
            sender: "user"
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system", content:
                        "Your task is. 1. Schedule an event. OR 2. Generate a plan for a task. You can ask me questions if needed. After I say that it is approved, create a json file formatted to send to Google Calendar or create a json file containing each task with their deadlines included and json approve button show on front"
                },
                ...messages.map(msg => ({
                    role: msg.sender === "ChatGPT" ? "assistant" : "user",
                    content: msg.message
                })),
                { role: "user", content: inputMessage }
            ]
        };

        try {
            const response = await sendMessage(apiRequestBody);
            const botMessages = [];

            if (parsedMessage !== inputMessage) {
                const parseConfirmMessage = {
                    message: parsedMessage,
                    direction: 'incoming',
                    sender: "ChatGPT"
                };
                botMessages.push(parseConfirmMessage);
            }

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
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleApproval = async () => {
        if (approvedPlan) {
            try {
                console.log("Sending approved plan to backend:", JSON.stringify(approvedPlan, null, 2));
                const response = await createEvent(approvedPlan);
                console.log("Plan approved and sent to backend:", response);
                setMessages(prevMessages => [...prevMessages, {
                    message: "Plan approved and sent to backend.",
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
