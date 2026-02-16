from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

# ===== Import your existing modules =====
from org_auth import create_account, login
from map_users import check_license, map_user, get_available_licenses

# ===== FastAPI App Setup =====
app = FastAPI(title="AI-DB-INSIGHTS", description="Authentication and License Management API", version="1.0.0")

# ===== CORS Setup =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all or specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AI-DB-INSIGHTS API is running smoothly",
        "version": "1.0.0"
    }

@app.post("/create_account")
async def create_account_endpoint(request: Request):
    data = await request.json()
    result = create_account(data["orgname"], data["email"], data["password"])
    return {"message": result}

@app.post("/login")
async def login_endpoint(request: Request):
    try:
        data = await request.json()
        # Add simpler debug logging if needed, or just catch exception
        msg, name = login(data["orgname"], data["email"], data["password"])
        return {"message": msg, "name": name}
    except Exception as e:
        import traceback
        return {"message": f"❌ Server Error: {str(e)}", "trace": traceback.format_exc()}

@app.get("/get_license_details")
async def get_license_details(orgname: str):
    msg, result = check_license(orgname)
    if result:
        return {"message": msg, "result": result}
    else:
        return {"message": msg}

@app.post("/map_user")
async def map_user_endpoint(request: Request):
    data = await request.json()
    result = map_user(data["email"], data["license_key"], data["orgname"])
    return {"message": result}

@app.get("/get_available_licenses")
async def get_available_licenses_endpoint():
    msg, result = get_available_licenses()
    return {"message": msg, "licenses": result}

if __name__ == "__main__":
    port = int(os.getenv("APP_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)