// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './globals.css';

import { MantineProvider, ColorSchemeScript, createTheme, MantineColorsTuple } from '@mantine/core';
import { Metadata } from 'next';
import '@mantine/notifications/styles.css';
import Head from 'next/head';
import { Suspense } from "react";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import { HeaderMenu } from '../components/HeaderMenu'
import { Footer } from '../components/Footer'
import { AuthProvider } from '../components/AuthContext';

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
  metadataBase: new URL('https://www.proengineer1exam.com'), 
};

// const myColor: MantineColorsTuple = [
//   "#e5f4ff",
//   "#cde2ff",
//   "#9bc2ff",
//   "#64a0ff",
//   "#3984fe",
//   "#1d72fe",
//   "#0969ff",
//   "#0058e4",
//   "#004ecc",
//   "#0043b5"
// ]

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,

  // shadows: {
  //   md: '1px 1px 3px rgba(0, 0, 0, .25)',
  //   xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  // },

  // headings: {
  //   fontFamily: 'Roboto, sans-serif',
  // },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="ja">
        <Head>
        <Suspense fallback={<></>}>
          <GoogleAnalytics />
        </Suspense>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta property="og:image" content="https://www.proengineer1exam.com/opengraph-image.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://www.proengineer1exam.com/twitter-image.png" />
          <meta name="twitter:image:type" content="image/png" />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="630" />
          <ColorSchemeScript />
        </Head>
        <body>
          <AuthProvider>
            <MantineProvider theme={theme} defaultColorScheme="light">
              <HeaderMenu />
              {children}
              <Footer />
            </MantineProvider>
          </AuthProvider>
          {/* <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> */}
        </body>
      </html>
    </>
);
}