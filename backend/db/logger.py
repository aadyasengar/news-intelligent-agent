import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "agent_logs.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            query TEXT,
            response TEXT,
            analytics TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def log_interaction(session_id: str, query: str, response: str, analytics: dict):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO interactions (session_id, query, response, analytics)
        VALUES (?, ?, ?, ?)
    ''', (session_id, query, response, json.dumps(analytics)))
    conn.commit()
    conn.close()

init_db()
