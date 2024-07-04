import os.path
import datetime as dt

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.config import SCOPES
from app.utils import load_json

def get_credentials():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds

def create_event(event_file):
    creds = get_credentials()
    try:
        service = build("calendar", "v3", credentials=creds)
        event_details = load_json(event_file)
        event = {
            "summary": event_details["summary"],
            "location": event_details["location"],
            "description": event_details["description"],
            "colorId": event_details["colorId"],
            "start": {
                "dateTime": event_details["start"]["dateTime"],
                "timeZone": event_details["start"]["timeZone"]
            },
            "end": {
                "dateTime": event_details["end"]["dateTime"],
                "timeZone": event_details["end"]["timeZone"]
            },
            "recurrence": event_details.get("recurrence", [])
        }
        event = service.events().insert(calendarId="primary", body=event).execute()
        print(f"Event created: {event.get('htmlLink')}")
    except HttpError as error:
        print("An error occurred:", error)

def get_upcoming_events():
    creds = get_credentials()
    try:
        service = build("calendar", "v3", credentials=creds)
        now = dt.datetime.now().isoformat() + 'Z'  # 'Z' indicates UTC time
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
