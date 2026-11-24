# Deployment script for Muhammed Raihan's Portfolio
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Deploying Muhammed Raihan O.A Portfolio  " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot

Write-Host "`n[1/3] Checking Git Status..." -ForegroundColor Yellow
git status

Write-Host "`n[2/3] Checking Remotes..." -ForegroundColor Yellow
git remote -v

Write-Host "`n[3/3] Pushing to GitHub (main branch)..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully deployed to GitHub!" -ForegroundColor Green
    Write-Host "Next step: Enable GitHub Pages in your repository settings:" -ForegroundColor Cyan
    Write-Host "Settings > Pages > Branch: 'main' > Save" -ForegroundColor White
} else {
    Write-Host "`n⚠️ Push failed. Please make sure you have created the empty repository on GitHub at:" -ForegroundColor Yellow
    Write-Host "https://github.com/new" -ForegroundColor White
    Write-Host "and that you are signed in to GitHub." -ForegroundColor Yellow
}
