import json
import os.path
import datetime as dt
import logging
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from app.config import SCOPES

logging.basicConfig(level=logging.INFO)

def load_json(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except Exception as e:
        logging.error(f"Failed to load JSON from {file_path}: {e}")
        raise

def get_credentials():
    creds = None
    try:
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
    except Exception as e:
        logging.error(f"Error handling credentials: {e}")
        raise
    return creds
