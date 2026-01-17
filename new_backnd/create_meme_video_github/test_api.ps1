# Test the video generation API

Write-Host "Testing video generation API..." -ForegroundColor Cyan

$body = @{
    github_url = "https://github.com/anthropics/claude-agent-sdk-typescript"
    voice = "Puck"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/generate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -OutFile "test_video.mp4" `
    -UseBasicParsing

Write-Host "Video saved to test_video.mp4" -ForegroundColor Green
