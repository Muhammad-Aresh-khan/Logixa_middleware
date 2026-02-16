import bcrypt
import sys
import os
import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, project_root)
from db_connector import conn, cursor

def check_license(orgname):
    orgname = orgname.strip().lower()
    try:
        sql = """ SELECT license_key, package_name, organization_name, issue_date, expiry_date, status FROM licenses WHERE TRIM(LOWER(organization_name)) = %s """
        cursor.execute(sql, (orgname,))
        results = cursor.fetchall()
        
        if not results:
            return "❌ License not found", None
        
        # Process all licenses for the organization
        active_licenses = []
        for row in results:
            lsc_key, pkg_name, org_name, issue_date, expiry_date, status = row
            
            # Check if license has expired
            if expiry_date < datetime.datetime.now():
                sql_update = "UPDATE licenses SET status = 'inactive' WHERE license_key = %s"
                cursor.execute(sql_update, (lsc_key,))
                conn.commit()
                continue  # Skip expired licenses
            
            # Check if license is active
            if status.lower() == "active":
                active_licenses.append({
                    "license_key": lsc_key,
                    "package_name": pkg_name,
                    "organization_name": org_name,
                    "issue_date": str(issue_date),
                    "expiry_date": str(expiry_date),
                    "status": status
                })
        
        if active_licenses:
            return "✅ Active licenses found", active_licenses
        else:
            return "❌ No active licenses found", None
            
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}", None 
def map_user(email, license_key, orgname):
    email = email.strip().lower()
    orgname = orgname.strip().lower()
    try:
        # Get license status and the actual organization it belongs to
        sql = """ SELECT used, organization_name FROM licenses WHERE license_key = %s """
        cursor.execute(sql, (license_key,))
        result = cursor.fetchone()
        
        if not result:
            return "❌ License key not found"
        
        used, actual_orgname = result
        
        if used:
            return "❌ License already used"
        
        # Check if organization billing is paid
        sql = """ SELECT billing FROM organizations WHERE TRIM(LOWER(organization_name)) = %s """
        cursor.execute(sql, (actual_orgname.strip().lower(),))
        org_result = cursor.fetchone()
        
        if org_result and org_result[0] and org_result[0].lower() == "unpaid":
            return "❌ Billing unpaid. Please contact support."
        
        # 1. Map the user
        sql = """ INSERT INTO map_users (user_email, license_key, organization_name) VALUES (%s, %s, %s) """
        cursor.execute(sql, (email, license_key, actual_orgname))
        
        # 2. Mark license as used
        sql = """ UPDATE licenses SET used = TRUE WHERE license_key = %s """
        cursor.execute(sql, (license_key,))
        
        # 3. Increment used_lsc in organizations
        # available_lsc is a generated column (lsc_limit - used_lsc), so it updates automatically
        sql = """ 
            UPDATE organizations 
            SET used_lsc = COALESCE(used_lsc, 0) + 1,
                updated_at = NOW()
            WHERE TRIM(LOWER(organization_name)) = %s 
        """
        cursor.execute(sql, (actual_orgname.strip().lower(),))
        
        conn.commit()
        return "✅ User mapped successfully" 
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}"

def get_available_licenses():
    """Get all available license packages for dropdown display"""
    try:
        sql = """ SELECT DISTINCT package_name, status FROM licenses WHERE status = 'active' ORDER BY package_name """
        cursor.execute(sql)
        results = cursor.fetchall()
        
        if not results:
            return "❌ No licenses available", []
        
        licenses = []
        for row in results:
            pkg_name, status = row
            licenses.append({
                "package_name": pkg_name,
                "status": status
            })
        
        return "✅ Licenses loaded", licenses
            
    except Exception as e:
        conn.rollback()
        return f"❌ Error: {str(e)}", []

