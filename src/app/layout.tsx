// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './globals.css';

import { MantineProvider, ColorSchemeScript, createTheme, MantineColorsTuple } from '@mantine/core';
import { Metadata } from 'next';

import classes from './active.module.css';
import { HeaderMenu } from '../components/HeaderMenu'

export const metadata: Metadata = {
  title: {
    default: '技術士1次試験 基礎•適正科目 過去問ドリル',
    template: `%s | 過去問ドリル`,
  },
  description: '公益社団法人日本技術士会が年1回開催する技術士1次試験の基礎科目と適性科目の過去問対策ができるサービス',
  openGraph: {
    title: {
      default: '技術士1次試験 基礎•適正科目 過去問ドリル',
      template: `%s | 過去問ドリル`,
    },
    description: '',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const myColor: MantineColorsTuple = [
  "#e5f4ff",
  "#cde2ff",
  "#9bc2ff",
  "#64a0ff",
  "#3984fe",
  "#1d72fe",
  "#0969ff",
  "#0058e4",
  "#004ecc",
  "#0043b5"
]

const theme = createTheme({
  colors: {
    myColor,
  }
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <HeaderMenu />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}