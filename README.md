# QR Character Generator

Ứng dụng web tạo QR code với theme nhân vật yêu thích, được xây dựng bằng Next.js và có thể deploy lên Vercel.

## Tính năng

- 🎨 Trang chủ hiển thị danh sách nhân vật với ảnh đẹp mắt
- 🖼️ Upload QR code và áp dụng theme màu sắc của nhân vật
- 🔄 Perspective warping để tích hợp QR code vào background
- 📥 Tải xuống ảnh kết quả

## Cài đặt

```bash
npm install
```

**Lưu ý về package `canvas`**: 
- Package `canvas` cần native dependencies và có thể khó cài đặt trên Windows
- Nếu gặp lỗi khi cài `canvas`, không sao - Vercel sẽ tự động cài đặt khi deploy
- Để test local, bạn có thể deploy lên Vercel và test trực tiếp trên đó
- Hoặc cài đặt GTK+ và các dependencies cần thiết cho Windows (xem SETUP.md)

## Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Build cho production

```bash
npm run build
npm start
```

## Setup ảnh

Sau khi clone project, bạn cần copy các file ảnh vào thư mục `public`:

```bash
npm run setup-images
```

Hoặc copy thủ công:
- Copy tất cả file từ `demo-img/` vào `public/demo-img/`
- Copy file `bg.jpg` từ mỗi thư mục nhân vật vào `public/[tên-thư-mục]/bg.jpg`

Cấu trúc thư mục `public` cần có:
```
public/
├── demo-img/
│   ├── Chii-Chobits.jpg
│   ├── conan.jpg
│   ├── Evernight.jpg
│   ├── March-7th.jpg
│   ├── Nefer.jpg
│   └── Yumemizuki-Mizuki.jpg
├── Chii-Chobits/
│   └── bg.jpg
├── conan/
│   └── bg.jpg
├── Evernight/
│   └── bg.jpg
├── March 7th/
│   └── bg.jpg
├── Nefer/
│   └── bg.jpg
└── Yumemizuki Mizuki/
    └── bg.jpg
```

## Deploy lên Vercel

1. Đảm bảo bạn đã có tất cả các file ảnh trong thư mục `public` (chạy `npm run setup-images`)

2. Push code lên GitHub

3. Import project vào Vercel:
   - Vào [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import repository từ GitHub
   - Vercel sẽ tự động detect Next.js và deploy
   - Đảm bảo chọn Node.js version 18 hoặc cao hơn

## Cấu trúc thư mục

```
.
├── app/
│   ├── api/
│   │   └── process-qr/     # API route xử lý QR code
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Trang chủ
├── components/
│   └── QRModal.tsx         # Modal để upload và xử lý QR
├── config/
│   └── characters.ts       # Config cho các nhân vật
├── public/                 # Static files (ảnh)
└── package.json
```

## Cấu hình nhân vật

Chỉnh sửa file `config/characters.ts` để thêm hoặc sửa nhân vật:

```typescript
{
  id: 'character-id',
  name: 'Tên nhân vật',
  image: '/demo-img/image.jpg',
  bgImage: '/folder/bg.jpg',
  color: {
    hex: '#HEXCOLOR',
    r: 255,
    g: 255,
    b: 255
  },
  coords: [
    { x: 0, y: 0 },  // Top-left
    { x: 100, y: 0 }, // Top-right
    { x: 100, y: 100 }, // Bottom-right
    { x: 0, y: 100 }   // Bottom-left
  ]
}
```

## Lưu ý

- Đảm bảo tất cả file ảnh được đặt đúng vị trí trong thư mục `public`
- API route sử dụng `canvas` package, cần cài đặt native dependencies trên server
- Vercel hỗ trợ `canvas` package tự động

"# qr" 
