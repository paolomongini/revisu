# Revisu - start the dashboard server and Claude Code (Windows)
Set-Location $PSScriptRoot
$port = 8765
$env:Path += ";$env:USERPROFILE\.local\bin"

function Find-Python {
    foreach ($c in @("python", "py", "python3")) {
        $cmd = Get-Command $c -ErrorAction SilentlyContinue
        if (-not $cmd -or $cmd.Source -like "*WindowsApps*") { continue }
        $a = @(); if ($c -eq "py") { $a = @("-3") }
        try { if ((& $c @a -c "import sys; print(sys.version_info >= (3, 9))" 2>$null) -eq "True") { return ,(@($c) + $a) } } catch { }
    }
    return $null
}
$py = Find-Python
if (-not $py) { Write-Host "Python not found: run setup.bat first." -ForegroundColor Yellow; Read-Host "Press Enter"; exit 1 }

# Load .env into this process only (the keys are not written anywhere else)
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*([A-Z_]+)\s*=\s*(.+)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2].Trim(), "Process")
        }
    }
}

if ($env:RADAR_PORT) { $port = [int]$env:RADAR_PORT } else { $env:RADAR_PORT = "$port" }
$server = Start-Process $py[0] -ArgumentList ((@($py | Select-Object -Skip 1)) + "scripts/server.py") `
    -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru
Start-Sleep -Milliseconds 1200
Start-Process "http://localhost:$port/dashboard/"
Write-Host ""
Write-Host "Revisu dashboard: http://localhost:$port/dashboard/  (agents can be launched from the page too)" -ForegroundColor Green
Write-Host "In Claude Code try:  /radar nn-sysid   |   /ask chi lavora su MPC in Italia?   |   /status" -ForegroundColor Cyan
Write-Host "Close this window (or type /exit) to stop everything." -ForegroundColor DarkGray
Write-Host ""

try {
    if (Get-Command claude -ErrorAction SilentlyContinue) {
        & claude
    } else {
        Write-Host "Claude Code not found - run setup.bat. The dashboard keeps running; press Enter to stop." -ForegroundColor Yellow
        Read-Host | Out-Null
    }
} finally {
    if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -Force }
}
