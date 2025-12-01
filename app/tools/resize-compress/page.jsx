// // app/tools/resize-compress/page.jsx
// "use client";

// import { useEffect, useRef, useState } from "react";

// const SIZE_PRESETS = [
//   { label: "Passport 413x531", width: 413, height: 531 },
//   { label: "NEET 600x600", width: 600, height: 600 },
//   { label: "SSC 100x120", width: 100, height: 120 },
//   { label: "Square 300x300", width: 300, height: 300 },
// ];

// const COMPRESS_PRESETS = [20, 50, 100, 200]; // KB

// export default function ResizeCompressPage() {
//   const [activeTab, setActiveTab] = useState("resize");
//   const [file, setFile] = useState(null);
//   const [originalUrl, setOriginalUrl] = useState(null);
//   const [resultUrl, setResultUrl] = useState(null);
//   const [resultBlob, setResultBlob] = useState(null); // NEW: store final blob

//   const [origWidth, setOrigWidth] = useState(null);
//   const [origHeight, setOrigHeight] = useState(null);

//   const [targetWidth, setTargetWidth] = useState("");
//   const [targetHeight, setTargetHeight] = useState("");
//   const [cropX, setCropX] = useState(0);
//   const [cropY, setCropY] = useState(0);
//   const [cropW, setCropW] = useState("");
//   const [cropH, setCropH] = useState("");

//   const [targetSizeValue, setTargetSizeValue] = useState("");
//   const [targetSizeUnit, setTargetSizeUnit] = useState("KB");
//   const [isCompressing, setIsCompressing] = useState(false);

//   const [format, setFormat] = useState("image/jpeg");

//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setOriginalUrl(url);
//     setResultUrl(null);
//     setResultBlob(null);

//     const img = new Image();
//     img.onload = () => {
//       setOrigWidth(img.width);
//       setOrigHeight(img.height);
//       setTargetWidth(img.width);
//       setTargetHeight(img.height);
//       setCropW(img.width);
//       setCropH(img.height);
//     };
//     img.src = url;

//     return () => {
//       URL.revokeObjectURL(url);
//       if (resultUrl) URL.revokeObjectURL(resultUrl);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [file]);

//   const handleFileChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFile(f);
//   };

//   async function drawToCanvas({ width, height, crop }) {
//     if (!originalUrl) throw new Error("No image loaded");

//     const img = new Image();
//     img.src = originalUrl;

//     await new Promise((resolve, reject) => {
//       img.onload = () => resolve();
//       img.onerror = reject;
//     });

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const sx = crop?.x ?? 0;
//     const sy = crop?.y ?? 0;
//     const sWidth = crop?.w ?? img.width;
//     const sHeight = crop?.h ?? img.height;

//     const dWidth = width ?? sWidth;
//     const dHeight = height ?? sHeight;

//     canvas.width = dWidth;
//     canvas.height = dHeight;

//     ctx.clearRect(0, 0, dWidth, dHeight);
//     ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);

//     return canvas;
//   }

//   const handleResizeCrop = async () => {
//     if (!file || !originalUrl) return;

//     const w = Number(targetWidth || origWidth);
//     const h = Number(targetHeight || origHeight);
//     const cx = Number(cropX) || 0;
//     const cy = Number(cropY) || 0;
//     const cw = Number(cropW || w);
//     const ch = Number(cropH || h);

//     try {
//       const canvas = await drawToCanvas({
//         width: w,
//         height: h,
//         crop: { x: cx, y: cy, w: cw, h: ch },
//       });

//       // For resize only, dataURL is fine
//       const dataUrl = canvas.toDataURL(format, 0.9);
//       setResultUrl(dataUrl);
//       setResultBlob(null); // no exact size for plain resize
//     } catch (err) {
//       console.error(err);
//       alert("Error while resizing/cropping image.");
//     }
//   };

//   const handleCompressToSize = async () => {
//     if (!file || !originalUrl || !targetSizeValue) return;

//     setIsCompressing(true);
//     try {
//       const targetBytes =
//         targetSizeUnit === "KB"
//           ? Number(targetSizeValue) * 1024
//           : Number(targetSizeValue) * 1024 * 1024;

//       const w = Number(targetWidth || origWidth);
//       const h = Number(targetHeight || origHeight);

//       const canvas = await drawToCanvas({
//         width: w,
//         height: h,
//         crop: {
//           x: Number(cropX) || 0,
//           y: Number(cropY) || 0,
//           w: Number(cropW || w),
//           h: Number(cropH || h),
//         },
//       });

//       // helper: quality → Blob
//       const getBlobForQuality = (quality) =>
//         new Promise((resolve, reject) => {
//           canvas.toBlob(
//             (blob) => {
//               if (!blob) return reject(new Error("toBlob failed"));
//               resolve(blob);
//             },
//             format,
//             quality
//           );
//         });

//       let low = 0.05;
//       let high = 0.95;
//       let bestBlob = null;

//       // binary search on quality
//       for (let i = 0; i < 8; i++) {
//         const mid = (low + high) / 2;
//         const blob = await getBlobForQuality(mid);
//         const size = blob.size;

//         if (size > targetBytes) {
//           // too large -> reduce quality
//           high = mid;
//         } else {
//           // under target -> keep and try a bit higher quality
//           bestBlob = blob;
//           low = mid;
//         }
//       }

//       const finalBlob = bestBlob || (await getBlobForQuality(low));
//       const url = URL.createObjectURL(finalBlob);

//       setResultBlob(finalBlob);
//       setResultUrl(url);
//     } catch (err) {
//       console.error(err);
//       alert("Error while compressing image.");
//     } finally {
//       setIsCompressing(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!resultUrl) return;
//     const a = document.createElement("a");
//     a.href = resultUrl;

//     const ext =
//       format === "image/png"
//         ? "png"
//         : format === "image/webp"
//         ? "webp"
//         : "jpg";

//     a.download = `processed-image.${ext}`;
//     a.click();
//   };

//   return (
//     <main>
//       <h1 className="text-3xl font-bold mb-2 text-center">Resize, Crop & Compress</h1>
//       <p className="text-center text-sm text-slate-300 mb-6">
//         Resize image by pixels, crop area, and compress to exact KB/MB. Includes exam photo presets similar to
//         Pi7 tools.
//       </p>

//       <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6 flex flex-col gap-3">
//         <label className="text-sm font-medium">Upload Image</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-slate-900 hover:file:bg-emerald-400"
//         />
//         {origWidth && origHeight && (
//           <p className="text-xs text-slate-400">
//             Original size: {origWidth} × {origHeight}px
//           </p>
//         )}
//       </div>

//       <div className="flex gap-2 mb-4 flex-wrap justify-center">
//         {["resize", "compress"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-full text-sm border ${
//               activeTab === tab
//                 ? "bg-emerald-500 text-slate-900 border-emerald-500"
//                 : "bg-slate-900 text-slate-200 border-slate-700 hover:border-emerald-400"
//             }`}
//           >
//             {tab === "resize" ? "Resize / Crop" : "Compress"}
//           </button>
//         ))}
//       </div>

//       <div className="grid md:grid-cols-2 gap-6 items-start">
//         {/* LEFT: controls */}
//         <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4">
//           {activeTab === "resize" && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">Resize & Crop</h2>

//               {/* SIZE PRESETS */}
//               <div className="mb-2">
//                 <p className="text-xs text-slate-400 mb-1">Exam / common size presets:</p>
//                 <div className="flex flex-wrap gap-2 text-xs">
//                   {SIZE_PRESETS.map((preset) => (
//                     <button
//                       key={preset.label}
//                       type="button"
//                       onClick={() => {
//                         setTargetWidth(preset.width);
//                         setTargetHeight(preset.height);
//                       }}
//                       className="px-3 py-1 rounded-full border border-slate-600 bg-slate-800 hover:border-emerald-400"
//                     >
//                       {preset.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Width / Height */}
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <label className="block mb-1">Width (px)</label>
//                   <input
//                     type="number"
//                     value={targetWidth}
//                     onChange={(e) => setTargetWidth(e.target.value)}
//                     className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1">Height (px)</label>
//                   <input
//                     type="number"
//                     value={targetHeight}
//                     onChange={(e) => setTargetHeight(e.target.value)}
//                     className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                   />
//                 </div>
//               </div>

//               {/* Crop */}
//               <h3 className="text-sm font-semibold mt-3">Crop (optional)</h3>
//               <p className="text-xs text-slate-400 mb-1">
//                 Set crop region from original image (x, y, width, height).
//               </p>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <label className="block mb-1">Crop X</label>
//                   <input
//                     type="number"
//                     value={cropX}
//                     onChange={(e) => setCropX(e.target.value)}
//                     className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1">Crop Y</label>
//                   <input
//                     type="number"
//                     value={cropY}
//                     onChange={(e) => setCropY(e.target.value)}
//                     className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1">Crop W</label>
//                   <input
//                     type="number"
//                     value={cropW}
//                     onChange={(e) => setCropW(e.target.value)}
//                     className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1">Crop H</label>
//                   <input
//                     type="number"
//                     value={cropH}
//                     onChange={(e) => setCropH(e.target.value)}
//                     className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                   />
//                 </div>
//               </div>

//               {/* Format */}
//               <div className="mt-3">
//                 <label className="block mb-1 text-sm">Output Format</label>
//                 <select
//                   value={format}
//                   onChange={(e) => setFormat(e.target.value)}
//                   className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-sm"
//                 >
//                   <option value="image/jpeg">JPEG</option>
//                   <option value="image/png">PNG</option>
//                   <option value="image/webp">WEBP</option>
//                 </select>
//               </div>

//               <button
//                 onClick={handleResizeCrop}
//                 disabled={!file}
//                 className="mt-4 w-full py-2 rounded-md bg-emerald-500 text-slate-900 font-semibold disabled:opacity-40"
//               >
//                 Apply Resize / Crop
//               </button>
//             </>
//           )}

//           {activeTab === "compress" && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">Compress to KB / MB</h2>

//               {/* COMPRESS PRESETS */}
//               <div className="mb-2">
//                 <p className="text-xs text-slate-400 mb-1">Quick presets (KB):</p>
//                 <div className="flex flex-wrap gap-2 text-xs">
//                   {COMPRESS_PRESETS.map((kb) => (
//                     <button
//                       key={kb}
//                       type="button"
//                       onClick={() => {
//                         setTargetSizeUnit("KB");
//                         setTargetSizeValue(kb);
//                       }}
//                       className="px-3 py-1 rounded-full border border-slate-600 bg-slate-800 hover:border-emerald-400"
//                     >
//                       {kb} KB
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex gap-3 items-center text-sm">
//                 <input
//                   type="number"
//                   value={targetSizeValue}
//                   onChange={(e) => setTargetSizeValue(e.target.value)}
//                   placeholder="e.g. 50"
//                   className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                 />
//                 <select
//                   value={targetSizeUnit}
//                   onChange={(e) => setTargetSizeUnit(e.target.value)}
//                   className="rounded-md bg-slate-800 border border-slate-600 px-2 py-1"
//                 >
//                   <option value="KB">KB</option>
//                   <option value="MB">MB</option>
//                 </select>
//               </div>

//               <div className="mt-3">
//                 <label className="block mb-1 text-sm">Output Format</label>
//                 <select
//                   value={format}
//                   onChange={(e) => setFormat(e.target.value)}
//                   className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-sm"
//                 >
//                   <option value="image/jpeg">JPEG</option>
//                   <option value="image/png">PNG</option>
//                   <option value="image/webp">WEBP</option>
//                 </select>
//               </div>

//               <button
//                 onClick={handleCompressToSize}
//                 disabled={!file || !targetSizeValue || isCompressing}
//                 className="mt-4 w-full py-2 rounded-md bg-emerald-500 text-slate-900 font-semibold disabled:opacity-40"
//               >
//                 {isCompressing ? "Compressing..." : "Compress to Target Size"}
//               </button>
//             </>
//           )}
//         </div>

//         {/* RIGHT: preview */}
//         <div className="space-y-4">
//           <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
//             <h2 className="text-sm font-semibold mb-2">Original</h2>
//             <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center overflow-hidden">
//               {originalUrl ? (
//                 <img src={originalUrl} alt="Original" className="max-h-80 object-contain" />
//               ) : (
//                 <p className="text-xs text-slate-500">Upload an image to start.</p>
//               )}
//             </div>
//           </div>

//           <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
//             <h2 className="text-sm font-semibold mb-2">Result</h2>
//             <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center overflow-hidden">
//               {resultUrl ? (
//                 <img src={resultUrl} alt="Result" className="max-h-80 object-contain" />
//               ) : (
//                 <p className="text-xs text-slate-500">Process image to see result.</p>
//               )}
//             </div>

//             {resultBlob && (
//               <p className="text-xs text-slate-400 mt-1">
//                 Final size: {(resultBlob.size / 1024).toFixed(1)} KB
//               </p>
//             )}

//             <button
//               onClick={handleDownload}
//               disabled={!resultUrl}
//               className="mt-3 w-full py-2 rounded-md bg-slate-100 text-slate-900 text-sm font-semibold disabled:opacity-40"
//             >
//               Download Result
//             </button>
//           </div>

//           <canvas ref={canvasRef} className="hidden" />
//         </div>
//       </div>
//     </main>
//   );
// }




// app/tools/resize-compress/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const SIZE_PRESETS = [
  { label: "Passport 413x531", width: 413, height: 531 },
  { label: "NEET 600x600", width: 600, height: 600 },
  { label: "SSC 100x120", width: 100, height: 120 },
  { label: "Square 300x300", width: 300, height: 300 },
];

const COMPRESS_PRESETS = [20, 50, 100, 200]; // KB

export default function ResizeCompressPage() {
  const [activeTab, setActiveTab] = useState("resize");
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultBlob, setResultBlob] = useState(null); // store final blob

  const [origWidth, setOrigWidth] = useState(null);
  const [origHeight, setOrigHeight] = useState(null);

  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState("");
  const [cropH, setCropH] = useState("");

  const [targetSizeValue, setTargetSizeValue] = useState("");
  const [targetSizeUnit, setTargetSizeUnit] = useState("KB");
  const [isCompressing, setIsCompressing] = useState(false);

  const [format, setFormat] = useState("image/jpeg");

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);
    setResultBlob(null);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
      setCropW(img.width);
      setCropH(img.height);
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  async function drawToCanvas({ width, height, crop }) {
    if (!originalUrl) throw new Error("No image loaded");

    const img = new Image();
    img.src = originalUrl;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const sx = crop?.x ?? 0;
    const sy = crop?.y ?? 0;
    const sWidth = crop?.w ?? img.width;
    const sHeight = crop?.h ?? img.height;

    const dWidth = width ?? sWidth;
    const dHeight = height ?? sHeight;

    canvas.width = dWidth;
    canvas.height = dHeight;

    ctx.clearRect(0, 0, dWidth, dHeight);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);

    return canvas;
  }

  const handleResizeCrop = async () => {
    if (!file || !originalUrl) return;

    const w = Number(targetWidth || origWidth);
    const h = Number(targetHeight || origHeight);
    const cx = Number(cropX) || 0;
    const cy = Number(cropY) || 0;
    const cw = Number(cropW || w);
    const ch = Number(cropH || h);

    try {
      const canvas = await drawToCanvas({
        width: w,
        height: h,
        crop: { x: cx, y: cy, w: cw, h: ch },
      });

      const dataUrl = canvas.toDataURL(format, 0.9);
      setResultUrl(dataUrl);
      setResultBlob(null);
    } catch (err) {
      console.error(err);
      alert("Error while resizing/cropping image.");
    }
  };

  const handleCompressToSize = async () => {
    if (!file || !originalUrl || !targetSizeValue) return;

    setIsCompressing(true);
    try {
      const targetBytes =
        targetSizeUnit === "KB"
          ? Number(targetSizeValue) * 1024
          : Number(targetSizeValue) * 1024 * 1024;

      const w = Number(targetWidth || origWidth);
      const h = Number(targetHeight || origHeight);

      const canvas = await drawToCanvas({
        width: w,
        height: h,
        crop: {
          x: Number(cropX) || 0,
          y: Number(cropY) || 0,
          w: Number(cropW || w),
          h: Number(cropH || h),
        },
      });

      const getBlobForQuality = (quality) =>
        new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("toBlob failed"));
              resolve(blob);
            },
            format,
            quality
          );
        });

      let low = 0.05;
      let high = 0.95;
      let bestBlob = null;

      for (let i = 0; i < 8; i++) {
        const mid = (low + high) / 2;
        const blob = await getBlobForQuality(mid);
        const size = blob.size;

        if (size > targetBytes) {
          high = mid;
        } else {
          bestBlob = blob;
          low = mid;
        }
      }

      const finalBlob = bestBlob || (await getBlobForQuality(low));
      const url = URL.createObjectURL(finalBlob);

      setResultBlob(finalBlob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error while compressing image.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;

    const ext =
      format === "image/png"
        ? "png"
        : format === "image/webp"
        ? "webp"
        : "jpg";

    a.download = `processed-image.${ext}`;
    a.click();
  };

  return (
    <main className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Resize, Crop & Compress
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
          Resize images by pixels, crop precisely, and compress to exact KB/MB values.
          Includes popular exam photo presets .
        </p>
      </header>

      {/* Upload card */}
      <div className="rounded-3xl border border-slate-200 bg-white px-4 py-5 md:px-6 md:py-6 shadow-sm flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-800">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
        />
        {origWidth && origHeight && (
          <p className="text-xs text-slate-500">
            Original size: {origWidth} × {origHeight}px
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-2 flex-wrap justify-center">
        {["resize", "compress"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              activeTab === tab
                ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:text-sky-700"
            }`}
          >
            {tab === "resize" ? "Resize / Crop" : "Compress"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* LEFT: controls */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm space-y-4">
          {activeTab === "resize" && (
            <>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Resize & Crop
              </h2>

              {/* SIZE PRESETS */}
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">
                  Exam / common size presets:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setTargetWidth(preset.width);
                        setTargetHeight(preset.height);
                      }}
                      className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50 text-slate-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Width / Height */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block mb-1 text-slate-700">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(e.target.value)}
                    className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(e.target.value)}
                    className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Crop */}
              <h3 className="text-sm font-semibold mt-3 text-slate-900">
                Crop (optional)
              </h3>
              <p className="text-xs text-slate-500 mb-1">
                Set crop region from original image (x, y, width, height).
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block mb-1 text-slate-700">Crop X</label>
                  <input
                    type="number"
                    value={cropX}
                    onChange={(e) => setCropX(e.target.value)}
                    className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">Crop Y</label>
                  <input
                    type="number"
                    value={cropY}
                    onChange={(e) => setCropY(e.target.value)}
                    className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">Crop W</label>
                  <input
                    type="number"
                    value={cropW}
                    onChange={(e) => setCropW(e.target.value)}
                    className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">Crop H</label>
                  <input
                    type="number"
                    value={cropH}
                    onChange={(e) => setCropH(e.target.value)}
                    className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Format */}
              <div className="mt-3">
                <label className="block mb-1 text-sm text-slate-700">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>

              <button
                onClick={handleResizeCrop}
                disabled={!file}
                className="mt-4 w-full py-2.5 rounded-md bg-sky-600 text-white text-sm font-semibold disabled:opacity-40 shadow-sm hover:bg-sky-700 transition"
              >
                Apply Resize / Crop
              </button>
            </>
          )}

          {activeTab === "compress" && (
            <>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Compress to KB / MB
              </h2>

              {/* COMPRESS PRESETS */}
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">Quick presets (KB):</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {COMPRESS_PRESETS.map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => {
                        setTargetSizeUnit("KB");
                        setTargetSizeValue(kb);
                      }}
                      className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50 text-slate-700"
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 items-center text-sm">
                <input
                  type="number"
                  value={targetSizeValue}
                  onChange={(e) => setTargetSizeValue(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
                <select
                  value={targetSizeUnit}
                  onChange={(e) => setTargetSizeUnit(e.target.value)}
                  className="rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>

              <div className="mt-3">
                <label className="block mb-1 text-sm text-slate-700">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-md bg-white border border-slate-200 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>

              <button
                onClick={handleCompressToSize}
                disabled={!file || !targetSizeValue || isCompressing}
                className="mt-4 w-full py-2.5 rounded-md bg-emerald-500 text-slate-900 text-sm font-semibold disabled:opacity-40 shadow-sm hover:bg-emerald-400 transition"
              >
                {isCompressing ? "Compressing..." : "Compress to Target Size"}
              </button>
            </>
          )}
        </div>

        {/* RIGHT: preview */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Original</h2>
            <div className="aspect-video rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              {originalUrl ? (
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-80 object-contain"
                />
              ) : (
                <p className="text-xs text-slate-500">
                  Upload an image to start.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Result</h2>
            <div className="aspect-video rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Result"
                  className="max-h-80 object-contain"
                />
              ) : (
                <p className="text-xs text-slate-500">
                  Process image to see result.
                </p>
              )}
            </div>

            {resultBlob && (
              <p className="text-xs text-slate-500 mt-1">
                Final size: {(resultBlob.size / 1024).toFixed(1)} KB
              </p>
            )}

            <button
              onClick={handleDownload}
              disabled={!resultUrl}
              className="mt-3 w-full py-2.5 rounded-md bg-slate-900 text-white text-sm font-semibold disabled:opacity-40 hover:bg-slate-800 transition"
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
