// app/components/AdLink.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdLink({
  href,                         // FINAL PAGE (your tool link)
  children,                     // clickable content
  className = "",
  countdownSeconds = 5,         // skip button timer
  adUrl = "https://www.effectivegatecpm.com/udi3851u7?key=576b59d65070a52acfa1ba58eb482f99",
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [seconds, setSeconds] = useState(countdownSeconds);
  const adWindowRef = useRef(null);
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (adWindowRef.current && !adWindowRef.current.closed) {
          adWindowRef.current.close();
        }
      } catch (_) {}
      clearInterval(timerRef.current);
    };
  }, []);

  const openAd = () => {
    // open ad URL in new window/tab (count click)
    const w = window.open(adUrl, "_blank", "noopener,noreferrer,width=900,height=700");
    adWindowRef.current = w;

    // show modal and start countdown
    setShowModal(true);
    setSeconds(countdownSeconds);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          goNow();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const goNow = () => {
    // close ad window if open
    try {
      if (adWindowRef.current && !adWindowRef.current.closed) {
        adWindowRef.current.close();
      }
    } catch (_) {}

    clearInterval(timerRef.current);
    setShowModal(false);

    // Defer router.push to the next macrotask to avoid "setState during render" issues.
    // This ensures navigation happens after React finishes the render cycle.
    setTimeout(() => {
      try {
        // prefer router.push for SPA navigation, but deferred
        router.push(href);
      } catch (e) {
        // fallback to full navigation if router fails
        window.location.href = href;
      }
    }, 0);
  };

  return (
    <>
      <button onClick={openAd} className={className} type="button">
        {children}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={goNow}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center"
          >
            <h2 className="text-sm font-semibold mb-2">Advertisement</h2>
            <p className="text-xs text-gray-500 mb-4">
              The ad opened in a new window. You can close it anytime.
            </p>

            <button
              onClick={goNow}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              type="button"
            >
              Skip Ad → {seconds > 0 ? `(${seconds})` : ""}
            </button>

            <div className="mt-3 text-xs text-gray-400">
              If the popup was blocked, please allow popups for this site.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
