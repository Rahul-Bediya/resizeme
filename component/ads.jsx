"use client";

import { useEffect, useRef } from "react";

export default function Ads({ scriptSrc, style = {} }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (!scriptSrc || !adRef.current) return;

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;

    adRef.current.innerHTML = ""; // Clear previous ads
    adRef.current.appendChild(script);
  }, [scriptSrc]);

  return (
    <div
      ref={adRef}
      style={{ width: "100%", minHeight: "100px", textAlign: "center", ...style }}
    >
      {/* Ad will load here */}
    </div>
  );
}
