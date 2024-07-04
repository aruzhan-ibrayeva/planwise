import os.path

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

def create_task(task_file):
    creds = get_credentials()
    try:
        service = build("tasks", "v1", credentials=creds)
        task_details = load_json(task_file)
        task = {
            "title": task_details["title"],
            "notes": task_details.get("notes"),
            "due": task_details.get("due")
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
