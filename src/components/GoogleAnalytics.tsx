"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { existsGaId, GA_MEASUREMENT_ID, pageview } from "../lib/gtag";

const GoogleAnalytics: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!existsGaId) {
      return;
    }

    const handleRouteChange = (url: string) => {
      console.log(`Route changed to: ${url}`);
      pageview(url);
    };

    // ルート変更時にページビューをトラッキング
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
