# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị code

Đảm bảo bạn đã:
- ✅ Copy tất cả ảnh vào thư mục `public` (chạy `npm run setup-images`)
- ✅ Code đã được commit và push lên GitHub

## Bước 2: Deploy lên Vercel

### Cách 1: Deploy qua Vercel Dashboard

1. Vào [vercel.com](https://vercel.com) và đăng nhập
2. Click **"New Project"**
3. Import repository từ GitHub
4. Vercel sẽ tự động detect Next.js
5. Click **"Deploy"**

### Cách 2: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Bước 3: Kiểm tra

Sau khi deploy xong, Vercel sẽ cung cấp URL. Mở URL đó và kiểm tra:
- Trang chủ hiển thị danh sách nhân vật
- Click vào "Tạo QR Code" và upload QR code
- Kiểm tra xem ảnh có được xử lý đúng không

## Lưu ý

- **Canvas package**: Vercel sẽ tự động cài đặt `canvas` package với native dependencies
- **File ảnh**: Đảm bảo tất cả file ảnh đã được commit vào Git (trong thư mục `public`)
- **Environment variables**: Không cần thiết cho project này

## Troubleshooting

### Lỗi "Background image not found"
- Kiểm tra xem tất cả file `bg.jpg` đã được copy vào `public/` chưa
- Kiểm tra đường dẫn trong `config/characters.ts`

### Lỗi "Canvas not found"
- Đây là lỗi chỉ xảy ra trên local
- Trên Vercel, canvas sẽ hoạt động bình thường
- Nếu vẫn lỗi trên Vercel, kiểm tra build logs

### Build time quá lâu
- Xử lý ảnh có thể mất thời gian
- Vercel có timeout 10 giây cho Hobby plan, 60 giây cho Pro plan
- Nếu cần, có thể tăng timeout trong `vercel.json`

