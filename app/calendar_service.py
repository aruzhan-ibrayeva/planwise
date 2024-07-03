import os.path
import datetime as dt

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.config import SCOPES

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

def create_event():
    creds = get_credentials()
    try:
        service = build("calendar", "v3", credentials=creds)
        event = {
            "summary": "PLANWISE EVENT",
            "location": "planwise-ai.com",
            "description": "Mvp of planwise ai",
            "colorId": 2,
            "start": {
                "dateTime": "2024-07-04T09:00:00+05:00",
                "timeZone": "Asia/Oral"
            },
            "end": {
                "dateTime": "2024-07-05T11:00:00+05:00",
                "timeZone": "Asia/Oral"
            },
            "recurrence": [
                "RRULE:FREQ=DAILY;COUNT=1"
            ]
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

def create_task(task_title, task_notes=None, due_date=None):
    creds = get_credentials()
    try:
        service = build("tasks", "v1", credentials=creds)
        task = {
            "title": task_title,
            "notes": task_notes,
            "due": due_date
        }
        result = service.tasks().insert(tasklist='@default', body=task).execute()
        print(f"Task created: {result.get('title')}")
    except HttpError as error:
        print("An error occurred:", error)

def get_tasks():
    creds = get_credentials()
    try:
        service = build("tasks", "v1", credentials=creds)
        tasks_result = service.tasks().list(tasklist='@default', maxResults=10).execute()
        tasks = tasks_result.get('items', [])
        if not tasks:
            print("No tasks found.")
        for task in tasks:
            print(f"{task['title']} - Due: {task.get('due')}")
    except HttpError as error:
        print("An error occurred:", error)
