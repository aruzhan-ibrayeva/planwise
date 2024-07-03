from app.calendar_service import create_event, get_upcoming_events, create_task, get_tasks

if __name__ == "__main__":
    create_event()
    get_upcoming_events()
    create_task("Sample Task", "This is a sample task.", "2024-07-04T17:00:00+05:00")
    get_tasks()
