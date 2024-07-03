import os.path
import datetime as dt

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar"]

def main():
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

    try:
        service = build("calendar", "v3", credentials=creds)

        event = {
            "summary": "Python Event",
            "location": "Online",
            "description": "Details of event",
            "colorId": 4,
            "start": {
                "dateTime": "2024-07-05T09:00:00+05:00",
                "timeZone": "Asia/Oral"
            },
            "end": {
                "dateTime": "2024-07-05T11:00:00+05:00",
                "timeZone": "Asia/Oral"
            },
            "recurrence": [
                "RRULE:FREQ=DAILY;COUNT=3"
            ],
            "attendees": [
                {"email": "aruabay@gmail.com"}
            ]
        }

        event = service.events().insert(calendarId="primary", body=event).execute()

        print(f"Event created: {event.get('htmlLink')}")

    except HttpError as error:
        print("An error occurred:", error)


if __name__ == "__main__":
    main()
