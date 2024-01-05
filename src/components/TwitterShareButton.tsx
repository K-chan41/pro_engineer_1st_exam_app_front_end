import React, { useEffect } from "react";

interface TwitterShareButtonProps {
  dataText: string;
}

interface TwitterWidgets {
  load: () => void;
}

interface Window {
  twttr: {
    widgets: TwitterWidgets;
  };
}

export function TwitterShareButton({ dataText }: TwitterShareButtonProps) {
  useEffect(() => {
    // すでにスクリプトが存在するか確認
    if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load();
        }
      };

      // コンポーネントがアンマウントされるときにスクリプトを削除
      return () => {
        script.remove();
      };
    }
    console.log(dataText);
  }, [dataText]);
  return (
    <>
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className="twitter-share-button"
        data-size="large"
        data-text={dataText}                  
        data-url="https://www.proengineer1exam.com" 
        data-hashtags="技術士" 
        data-show-count="false"
      >Tweet</a>
      {/* <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> */}
    </>
  );
};
