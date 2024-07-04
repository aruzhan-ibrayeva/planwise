from app.calendar_service import create_event, get_upcoming_events
from app.task_service import create_task, get_tasks

if __name__ == "__main__":
    create_event("jsonfiles/event_details.json")
    get_upcoming_events()
    create_task("jsonfiles/task_details.json")
    get_tasks()
