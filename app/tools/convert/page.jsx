"use client";

import { useEffect, useRef, useState } from "react";

export default function ConvertPage() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [origWidth, setOrigWidth] = useState(null);
  const [origHeight, setOrigHeight] = useState(null);
  const [format, setFormat] = useState("image/jpeg");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleConvert = async () => {
    if (!originalUrl) return;
    const img = new Image();
    img.src = originalUrl;

    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL(format, 0.9);
    setResultUrl(dataUrl);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;

    const ext =
      format === "image/png" ? "png" :
      format === "image/webp" ? "webp" :
      "jpg";

    a.download = `converted.${ext}`;
    a.click();
  };

  return (
    <main className="pb-10">
      <h1 className="text-4xl font-bold mb-3 text-center text-gray-800">
        Convert Image Format
      </h1>

      <p className="text-center text-gray-500 text-sm mb-8">
        Convert PNG, JPG, WEBP instantly inside your browser.
      </p>

      {/* UPLOAD BOX */}
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

        {origWidth && origHeight && (
          <p className="text-xs text-gray-500">
            Original size: {origWidth} × {origHeight}px
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* LEFT SETTINGS */}
        <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>

          <label className="block mb-1 text-sm text-gray-600">Output Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full rounded-md bg-white border border-[#C8E7E7] px-2 py-2 text-sm"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>

          <button
            onClick={handleConvert}
            disabled={!file}
            className="mt-4 w-full py-2 rounded-lg 
            bg-[#00C4C4] text-white font-semibold 
            hover:bg-[#00b2b2] disabled:opacity-40"
          >
            Convert
          </button>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="space-y-5">

          {/* ORIGINAL */}
          <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-2 text-gray-700">Original</h2>
            <div className="aspect-video bg-[#F2FFFF] rounded-md flex items-center justify-center overflow-hidden border border-[#D7F1F1]">
              {originalUrl ? (
                <img src={originalUrl} alt="Original" className="max-h-80 object-contain" />
              ) : (
                <p className="text-xs text-gray-500">Upload an image.</p>
              )}
            </div>
          </div>

          {/* RESULT */}
          <div className="bg-white border border-[#DCEAEA] shadow-sm rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-2 text-gray-700">Result</h2>

            <div className="aspect-video bg-[#F2FFFF] rounded-md flex items-center justify-center overflow-hidden border border-[#D7F1F1]">
              {resultUrl ? (
                <img src={resultUrl} alt="Result" className="max-h-80 object-contain" />
              ) : (
                <p className="text-xs text-gray-500">Convert to see result.</p>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!resultUrl}
              className="mt-3 w-full py-2 rounded-lg bg-[#007A7A] text-white text-sm font-semibold disabled:opacity-40"
            >
              Download Result
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </main>
  );
}
