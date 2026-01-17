# Add FFmpeg to PATH for this session and start the server

$ffmpegPath = "C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"

# Add to current session PATH
$env:Path = "$ffmpegPath;$env:Path"

Write-Host "FFmpeg added to PATH" -ForegroundColor Green
Write-Host "Testing FFmpeg..." -ForegroundColor Cyan

# Test FFmpeg
& ffmpeg -version | Select-Object -First 1

Write-Host "`nStarting FastAPI server..." -ForegroundColor Cyan
Write-Host "Server will be available at http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow

# Start the server
python server.py
