# Hướng dẫn Setup

## Bước 1: Cài đặt dependencies

```bash
npm install
```

## Bước 2: Copy ảnh vào thư mục public

Chạy script tự động:

```bash
npm run setup-images
```

Hoặc copy thủ công:

1. Tạo thư mục `public` nếu chưa có
2. Copy tất cả file từ `demo-img/` vào `public/demo-img/`
3. Copy file `bg.jpg` từ mỗi thư mục nhân vật:
   - `Chii-Chobits/bg.jpg` → `public/Chii-Chobits/bg.jpg`
   - `conan/bg.jpg` → `public/conan/bg.jpg`
   - `Evernight/bg.jpg` → `public/Evernight/bg.jpg`
   - `March 7th/bg.jpg` → `public/March 7th/bg.jpg`
   - `Nefer/bg.jpg` → `public/Nefer/bg.jpg`
   - `Yumemizuki Mizuki/bg.jpg` → `public/Yumemizuki Mizuki/bg.jpg`

## Bước 3: Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## Lưu ý

- Đảm bảo tất cả file ảnh có đúng tên và định dạng `.jpg`
- Nếu gặp lỗi về `canvas`, có thể cần cài đặt native dependencies:
  - Windows: Cài đặt Visual Studio Build Tools
  - macOS: `xcode-select --install`
  - Linux: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`

