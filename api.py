from flask import Flask, jsonify, request
from app.calendar_service import create_event, get_upcoming_events
from app.task_service import create_task, get_tasks
from flask_cors import CORS
import logging

from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
socketio = SocketIO(app)

@app.route('/create-event', methods=['POST'])
def api_create_event():
    try:
        event_data = request.json
        if not event_data:
            return jsonify({'message': 'No data provided'}), 400
        event_link = create_event(event_data)
        return jsonify({'message': 'Event created successfully', 'link': event_link}), 201
    except Exception as e:
        logging.error(f"Failed to create event: {e}")
        return jsonify({'message': 'Failed to create event', 'error': str(e)}), 500

@app.route('/get-events', methods=['GET'])
def api_get_events():
    try:
        events = get_upcoming_events()
        return jsonify(events), 200
    except Exception as e:
        logging.error(f"Failed to retrieve events: {e}")
        return jsonify({'message': 'Failed to retrieve events', 'error': str(e)}), 500

@app.route('/create-task', methods=['POST'])
def api_create_task():
    try:
        task_data = request.json
        if not task_data:
            return jsonify({'message': 'No data provided'}), 400
        task = create_task(task_data)
        return jsonify({'message': 'Task created successfully', 'task': task}), 201
    except Exception as e:
        logging.error(f"Failed to create task: {e}")
        return jsonify({'message': 'Failed to create task', 'error': str(e)}), 500

@app.route('/get-tasks', methods=['GET'])
def get_tasks_route():
    tasks = get_tasks()
    return jsonify(tasks)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == "__main__":
    socketio.run(app, debug=True)