import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '技術士1次試験 基礎•適正科目 過去問ドリル',
    short_name: '技術士過去問ドリル',
    description: '公益社団法人日本技術士会が年1回開催する技術士1次試験の基礎科目と適性科目の過去問対策アプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}