# Hướng dẫn Push lên GitHub và Deploy Vercel

## Bước 1: Cài đặt Git (nếu chưa có)

1. Tải Git từ: https://git-scm.com/download/win
2. Cài đặt với các tùy chọn mặc định
3. Mở lại terminal/PowerShell

## Bước 2: Push code lên GitHub

Mở PowerShell hoặc Command Prompt tại thư mục `c:\xampp\htdocs` và chạy:

```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit - QR Character Generator"

# Thêm remote repository
git remote add origin https://github.com/wuziuu/qr.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

**Lưu ý:** Nếu repository đã có code, bạn có thể cần:
```bash
git pull origin main --allow-unrelated-histories
# Sau đó push lại
git push -u origin main
```

## Bước 3: Deploy lên Vercel

### Cách 1: Qua Vercel Dashboard (Khuyên dùng)

1. Vào [vercel.com](https://vercel.com) và đăng nhập bằng GitHub
2. Click **"Add New..."** → **"Project"**
3. Import repository `wuziuu/qr`
4. Vercel sẽ tự động detect Next.js
5. **Không cần thay đổi gì**, click **"Deploy"**
6. Đợi build xong (khoảng 2-3 phút)

### Cách 2: Qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

## Bước 4: Kiểm tra

Sau khi deploy xong:
- Vercel sẽ cung cấp URL như: `https://qr-xxx.vercel.app`
- Mở URL và test các chức năng:
  - ✅ Trang chủ hiển thị danh sách nhân vật
  - ✅ Click "Tạo QR Code" mở modal
  - ✅ Upload QR code và xử lý

## Troubleshooting

### Lỗi "Repository not found"
- Kiểm tra bạn đã đăng nhập GitHub đúng chưa
- Kiểm tra quyền truy cập repository

### Lỗi Build trên Vercel
- Kiểm tra build logs trên Vercel dashboard
- Đảm bảo tất cả file ảnh đã được commit vào Git
- Kiểm tra `package.json` có đúng dependencies không

### Lỗi "Canvas not found" trên Vercel
- Vercel sẽ tự động cài `@napi-rs/canvas` với native bindings
- Nếu vẫn lỗi, kiểm tra Node.js version (nên dùng 18.x hoặc 20.x)

