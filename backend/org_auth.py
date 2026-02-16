import bcrypt
import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, cursor
def create_account(orgname, email, password):
    orgname = orgname.strip().lower()
    email = email.strip().lower()

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        sql = """ SELECT * FROM organizations WHERE TRIM(LOWER(organization_name)) = %s AND TRIM(LOWER(organization_email)) = %s """
        cursor.execute(sql, (orgname, email))
        result = cursor.fetchone()
        print(f"QUERY RESULT FOR {orgname}: {result}", flush=True)
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"
    
    if result:
        try:
            sql = """ INSERT INTO org_auth (organization_name, organization_email, password) VALUES (%s, %s, %s) """
            cursor.execute(sql, (orgname, email, hashed_password))
            conn.commit()
            return f"✅ User created successfully with: {orgname}"
        except Exception as e:
            conn.rollback()
            return f"❌ User exists - not allowed multiple admin under organization: {str(e)}"
    else:
        return "❌ Organization does not exist"

def login(orgname, email, password):
    orgname = orgname.strip().lower()
    email = email.strip().lower()
    try:
        sql = """ SELECT password FROM org_auth WHERE TRIM(LOWER(organization_name)) = %s AND TRIM(LOWER(organization_email)) = %s """
        cursor.execute(sql, (orgname, email))
        result = cursor.fetchone()
        
        if result:
            stored_password_hash = result[0]
            # Verify password
            if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                return "✅ Login successful", orgname
            else:
                return "❌ Invalid credentials", None
        else:
            return "❌ Invalid credentials", None
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}", None