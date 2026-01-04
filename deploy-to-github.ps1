# Script để push code lên GitHub
# Chạy script này sau khi đã cài Git

Write-Host "=== Deploy to GitHub ===" -ForegroundColor Green

# Kiểm tra Git đã được cài chưa
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài Git từ: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra xem đã là git repo chưa
if (-not (Test-Path ".git")) {
    Write-Host "Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
}

# Thêm tất cả files
Write-Host "Đang thêm files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Đang commit..." -ForegroundColor Yellow
git commit -m "Initial commit - QR Character Generator" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Không có thay đổi nào để commit hoặc đã commit rồi" -ForegroundColor Yellow
}

# Kiểm tra remote
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Thêm remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/wuziuu/qr.git
} else {
    Write-Host "Remote đã tồn tại: $remoteExists" -ForegroundColor Green
    Write-Host "Cập nhật remote URL..." -ForegroundColor Yellow
    git remote set-url origin https://github.com/wuziuu/qr.git
}

# Đổi branch sang main
Write-Host "Đổi branch sang main..." -ForegroundColor Yellow
git branch -M main 2>&1 | Out-Null

# Push lên GitHub
Write-Host "Đang push lên GitHub..." -ForegroundColor Yellow
Write-Host "Lưu ý: Bạn có thể cần nhập username và password/token GitHub" -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== THÀNH CÔNG! ===" -ForegroundColor Green
    Write-Host "Code đã được push lên: https://github.com/wuziuu/qr.git" -ForegroundColor Green
    Write-Host "`nBước tiếp theo:" -ForegroundColor Yellow
    Write-Host "1. Vào https://vercel.com và đăng nhập" -ForegroundColor White
    Write-Host "2. Click 'Add New Project'" -ForegroundColor White
    Write-Host "3. Import repository 'wuziuu/qr'" -ForegroundColor White
    Write-Host "4. Click 'Deploy'" -ForegroundColor White
} else {
    Write-Host "`n=== LỖI KHI PUSH ===" -ForegroundColor Red
    Write-Host "Có thể do:" -ForegroundColor Yellow
    Write-Host "- Chưa đăng nhập GitHub" -ForegroundColor White
    Write-Host "- Repository chưa được tạo trên GitHub" -ForegroundColor White
    Write-Host "- Không có quyền truy cập repository" -ForegroundColor White
    Write-Host "`nThử chạy lại script hoặc push thủ công bằng lệnh:" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Cyan
}

