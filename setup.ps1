# Revisu - one-time setup for Windows. Safe to run again (e.g. to change keys).
# Installs what is missing (Python, Claude Code), asks for the optional keys, tests the data layer.
# ASCII only on purpose: Windows PowerShell 5.1 misreads UTF-8 files without BOM.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Ok($m)   { Write-Host "  [OK] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "  [!]  $m" -ForegroundColor Yellow }
function Step($m) { Write-Host ""; Write-Host "== $m" -ForegroundColor Cyan }
function Refresh-Path {
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
                [Environment]::GetEnvironmentVariable("Path", "User") + ";" + "$env:USERPROFILE\.local\bin"
}

# Returns the command that runs a real Python >= 3.9 (skips the Microsoft Store "python" stub)
function Find-Python {
    foreach ($c in @("python", "py", "python3")) {
        $cmd = Get-Command $c -ErrorAction SilentlyContinue
        if (-not $cmd -or $cmd.Source -like "*WindowsApps*") { continue }
        $pa = @(); if ($c -eq "py") { $pa = @("-3") }
        try {
            $ok = & $c @pa -c "import sys; print(sys.version_info >= (3, 9))" 2>$null
            if ($ok -eq "True") { return ,(@($c) + $pa) }
        } catch { }
    }
    return $null
}

Write-Host ""
Write-Host "=== Revisu - Research Visualisation Support - setup ===" -ForegroundColor Cyan

Step "1/4 Python"
$py = Find-Python
if (-not $py) {
    Warn "Python 3.9+ not found."
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host "  Installing Python 3.12 with winget (a Windows prompt may ask for confirmation)..."
        winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements --silent
        Refresh-Path
        $py = Find-Python
    }
    if (-not $py) {
        Warn "Please install Python from https://www.python.org/downloads/ (tick 'Add python.exe to PATH'),"
        Warn "then run setup.bat again."
        exit 1
    }
}
$pyExe = $py[0]; $pyArgs = @($py | Select-Object -Skip 1)
Ok ("Python: " + (& $pyExe @pyArgs --version))

Step "2/4 Claude Code"
Refresh-Path
if (Get-Command claude -ErrorAction SilentlyContinue) {
    Ok ("Claude Code: " + (& claude --version))
} else {
    Write-Host "  Installing Claude Code with the official installer (https://claude.ai/install.ps1)..."
    try {
        Invoke-RestMethod https://claude.ai/install.ps1 | Invoke-Expression
        Refresh-Path
    } catch { Warn "Installer failed: $_" }
    if (Get-Command claude -ErrorAction SilentlyContinue) { Ok "Claude Code installed" }
    else { Warn "Claude Code not found. Install it from https://claude.com/claude-code and run setup.bat again."; exit 1 }
}

Step "3/4 Keys (saved only in the local .env file, never shared)"
$envFile = Join-Path $PSScriptRoot ".env"
$vals = [ordered]@{}
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^\s*([A-Z_]+)\s*=\s*(.*)$') { $vals[$matches[1]] = $matches[2] }
    }
}
function Read-Secret($prompt) {
    $s = Read-Host $prompt -AsSecureString
    $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b).Trim() }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}
$sub = Read-Host "  Do you use Claude with a Pro/Max subscription? [Y/n]"
if ($sub -match '^[nN]') {
    Write-Host "  Anthropic API key from https://console.anthropic.com (Enter keeps the saved one)"
    $k = Read-Secret "  ANTHROPIC_API_KEY"
    if ($k) { $vals["ANTHROPIC_API_KEY"] = $k }
} else {
    Ok "subscription: you will log in inside Claude Code on first start (no key needed)"
}
Write-Host ""
Write-Host "  OpenAlex key: FREE and optional, but without it you can download only ~5 topics per day."
Write-Host "  Get one at https://openalex.org/settings/api  (Enter = skip / keep the saved one)"
$o = Read-Secret "  OPENALEX_API_KEY"
if ($o) { $vals["OPENALEX_API_KEY"] = $o }
$out = @("# Revisu secrets - never commit or share this file")
foreach ($key in $vals.Keys) { $out += "$key=$($vals[$key])" }
Set-Content -Path $envFile -Value $out -Encoding ASCII
Ok (".env saved (" + (($vals.Keys) -join ", ") + ")")

Step "4/4 Test"
& $pyExe @pyArgs scripts/radar.py index | Out-Null
Ok "data layer works (no extra libraries needed)"

Write-Host ""
Write-Host "Setup complete. Now double-click  start.bat" -ForegroundColor Green
Write-Host "The first time, Claude Code asks you to log in and whether you trust this folder: answer Yes." -ForegroundColor Green
