from db_connector import conn, cursor

def list_tables():
    with open("db_schema.txt", "w", encoding="utf-8") as f:
        try:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = cursor.fetchall()
            f.write("--- Database Schema ---\n")
            for (table_name,) in tables:
                f.write(f"Table: {table_name}\n")
                cursor.execute(f"""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = '{table_name}'
                    ORDER BY ordinal_position
                """)
                columns = cursor.fetchall()
                for col_name, data_type in columns:
                    f.write(f"  - {col_name}: {data_type}\n")
            f.write("--- End of Schema ---\n")
        except Exception as e:
            f.write(f"Error: {e}\n")

if __name__ == "__main__":
    list_tables()
