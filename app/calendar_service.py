from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.utils import get_credentials
import logging
import datetime as dt

def create_event(event_data):
    creds = get_credentials()
    service = build("calendar", "v3", credentials=creds)
    
    start_time = event_data.get('start', {}).get('dateTime')
    end_time = event_data.get('end', {}).get('dateTime')
    time_zone = event_data.get('start', {}).get('timeZone')

    event = {
        'summary': event_data.get('summary', 'No Title'),
        'location': event_data.get('location', ''),
        'description': event_data.get('description', ''),
        'start': {
            'dateTime': start_time,
            'timeZone': time_zone
        },
        'end': {
            'dateTime': end_time,
            'timeZone': time_zone
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=1'
        ],
        'attendees': [
            {'email': attendee.get('email')} for attendee in event_data.get('attendees', [])
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    return event.get('htmlLink')  # Returning the link to the created event


def get_upcoming_events():
    creds = get_credentials()
    try:
        service = build("calendar", "v3", credentials=creds)
        now = dt.now().isoformat() + 'Z'  # 'Z' indicates UTC time
        events_result = service.events().list(
            calendarId='primary', timeMin=now,
            maxResults=5, singleEvents=True,
            orderBy='startTime').execute()
        events = events_result.get('items', [])
        with open("upcoming_events.txt", "w") as file:
            if not events:
                file.write("No upcoming events found.\n")
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                file.write(f"{start} - {event['summary']}\n")
        print("5 upcoming events are inserted into upcoming_events.txt")
    except HttpError as error:
        print("An error occurred:", error)
