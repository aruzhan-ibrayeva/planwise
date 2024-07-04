const API_BASE_URL = 'http://127.0.0.1:5000'; 

export const createEvent = async (eventData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/create-event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to create event:', error);
        throw error;
    }
};

export const fetchEvents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-events`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
};
