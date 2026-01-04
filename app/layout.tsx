import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Character Generator',
  description: 'Tạo QR code với theme nhân vật yêu thích',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}

