import sys
import os
sys.path.insert(0, 'backend')
from db_connector import cursor

# Get map_users table columns
cursor.execute("""
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'map_users'
    ORDER BY ordinal_position
""")

columns = cursor.fetchall()
print("map_users table columns:")
for col in columns:
    print(f"  - {col[0]}")
