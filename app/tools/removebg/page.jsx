"use client";

import { useEffect, useState } from "react";

export default function BackgroundRemovePage() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleRemoveBackground = async () => {
    if (!file) return;
    setIsRemoving(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/removebg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API FAILURE:", text);
        alert("Background removal failed.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "no-background.png";
    a.click();
  };

  return (
    <main className="pb-10">
      <h1 className="text-4xl font-bold mb-3 text-center text-gray-800">
        Background Remover
      </h1>

      <p className="text-center text-gray-500 text-sm mb-8">
        Remove backgrounds instantly using an AI-powered API.
      </p>

      {/* Upload Box */}
      <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5 mb-8 flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">Upload Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border file:border-[#b5e8e8]
            file:text-sm file:font-semibold
            file:bg-[#b8f0f0] file:text-gray-900
            hover:file:bg-[#a3e6e6]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* Controls */}
        <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Controls</h2>

          <button
            onClick={handleRemoveBackground}
            disabled={!file || isRemoving}
            className="w-full py-2 rounded-lg
              bg-[#00C4C4] text-white font-semibold
              hover:bg-[#00b2b2] disabled:opacity-40"
          >
            {isRemoving ? "Removing..." : "Remove Background"}
          </button>
        </div>

        {/* Previews */}
        <div className="space-y-6">

          {/* Original Image */}
          <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Original</h2>

            <div className="aspect-video bg-[#F2FFFF] rounded-md border border-[#D7F1F1]
                flex items-center justify-center overflow-hidden">
              {originalUrl ? (
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-80 object-contain"
                />
              ) : (
                <p className="text-xs text-gray-500">Upload an image to start.</p>
              )}
            </div>
          </div>

          {/* Result Image */}
          <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Result</h2>

            <div className="aspect-video bg-[#F2FFFF] rounded-md border border-[#D7F1F1]
                flex items-center justify-center overflow-hidden">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Result"
                  className="max-h-80 object-contain"
                />
              ) : (
                <p className="text-xs text-gray-500">Process to see result.</p>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!resultUrl}
              className="mt-3 w-full py-2 rounded-lg
                bg-[#007A7A] text-white text-sm font-semibold
                disabled:opacity-40"
            >
              Download Result
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
