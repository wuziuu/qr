# Hướng dẫn nhanh - Deploy lên GitHub & Vercel

## ⚡ Cách nhanh nhất

### 1. Cài Git (nếu chưa có)
Tải và cài từ: https://git-scm.com/download/win

### 2. Push lên GitHub

**Cách A: Dùng script tự động (Khuyên dùng)**
```powershell
# Mở PowerShell tại thư mục c:\xampp\htdocs
.\deploy-to-github.ps1
```

**Cách B: Chạy thủ công**
```bash
git init
git add .
git commit -m "Initial commit - QR Character Generator"
git remote add origin https://github.com/wuziuu/qr.git
git branch -M main
git push -u origin main
```

### 3. Deploy lên Vercel

1. Vào https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"Add New..."** → **"Project"**
4. Tìm và chọn repository **"wuziuu/qr"**
5. Click **"Deploy"** (không cần thay đổi gì)
6. Đợi 2-3 phút để build xong

### 4. Xong! 🎉

Vercel sẽ cung cấp URL như: `https://qr-xxx.vercel.app`

---

## ❓ Gặp vấn đề?

### Git chưa được cài
- Tải từ: https://git-scm.com/download/win
- Cài đặt với tùy chọn mặc định
- Mở lại PowerShell

### Lỗi khi push GitHub
- Kiểm tra đã đăng nhập GitHub chưa
- Kiểm tra repository đã được tạo trên GitHub chưa
- Có thể cần dùng Personal Access Token thay vì password

### Lỗi build trên Vercel
- Kiểm tra build logs trên Vercel dashboard
- Đảm bảo tất cả file ảnh đã được commit
- Kiểm tra `package.json` có đúng không

---

## 📁 Files quan trọng đã được tạo

- ✅ `package.json` - Dependencies
- ✅ `next.config.js` - Cấu hình Next.js
- ✅ `app/` - Code ứng dụng
- ✅ `public/` - Ảnh và assets
- ✅ `.gitignore` - Ignore files không cần thiết
- ✅ `vercel.json` - Cấu hình Vercel

Tất cả đã sẵn sàng để deploy! 🚀

