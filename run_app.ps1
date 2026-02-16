# AI DB Insights - Centralized Startup Script

$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend-react"
$envFile = Join-Path $backendDir ".env"

# Load environment variables from .env
if (Test-Path $envFile) {
    Write-Host "Loading configuration from $envFile..." -ForegroundColor Gray
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#\s][^=]*)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace "^['""]|['""]$", ""
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$appPort = if ($env:APP_PORT) { $env:APP_PORT } else { "5000" }
$frontendPort = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { "5174" }

Write-Host "`n--- AI DB Insights ---" -ForegroundColor Blue -BackgroundColor White
Write-Host "Backend Port:  $appPort"
Write-Host "Frontend Port: $frontendPort"
Write-Host "----------------------`n"

# Start Backend in a separate window
Write-Host "Starting Backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; uvicorn main:app --port $appPort --reload"

# Start Frontend in current window
Write-Host "Starting Frontend development server..." -ForegroundColor Cyan
cd $frontendDir
npm run dev -- --port $frontendPort
