from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.utils import get_credentials

def create_task(task_details):
    creds = get_credentials()
    try:
        service = build("tasks", "v1", credentials=creds)
        task = {
            "title": task_details["title"],
            "notes": task_details.get("notes"),
            "due": task_details.get("due")
        }
        result = service.tasks().insert(tasklist='@default', body=task).execute()
        return result  
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None

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
