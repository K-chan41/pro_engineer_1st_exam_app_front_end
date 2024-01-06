import React from "react";

interface TwitterShareButtonProps {
  dataText: string;
}

export function TwitterShareButton({ dataText }: TwitterShareButtonProps) {
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
      <script async src="https://platform.twitter.com/widgets.js" ></script>
    </>
  );
};
