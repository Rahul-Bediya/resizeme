"use client";
import Script from "next/script";

export default function AdestraAd() {
  return (
    <div className="my-8 flex justify-center">
      {/* Inline config */}
      <Script
        id="adestra-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '293dc6d8dd3c9cc151225bead50577fc',
              'format' : 'iframe',
              'height' : 300,
              'width' : 160,
              'params' : {}
            };
          `,
        }}
      />

      {/* External script */}
      <Script
        id="adestra-external"
        src="https://www.highperformanceformat.com/293dc6d8dd3c9cc151225bead50577fc/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
