import { parse } from 'chrono-node';

export const formatMessageWithDate = (inputMessage) => {
    const results = parse(inputMessage);
    if (results.length > 0) {
        const { start } = results[0];
        const date = start.date();
        return `${inputMessage} (${date.toLocaleDateString()} at ${date.toLocaleTimeString()})`;
    }
    return inputMessage;
};
