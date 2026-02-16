import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)

from dotenv import load_dotenv
load_dotenv()
import psycopg2

# --- Connect to PostgreSQL ---
conn = psycopg2.connect(
    host=os.getenv("host"),
    database=os.getenv("database"),
    user=os.getenv("user"),
    password=os.getenv("password"),
    port=os.getenv("port")
)
if conn:
    print("Database connection established")
cursor = conn.cursor()
