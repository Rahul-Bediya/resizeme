"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Loader2,
  File,
  Menu,
  Github,
  FileType,
} from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | uploading | converting | completed
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const fileInputRef = useRef(null);

  // -------------------
  // 📌 Utility Functions
  // -------------------

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (inputFile) => {
    if (!inputFile) return false;
    if (inputFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return false;
    }
    return true;
  };

  // -------------------
  // 📌 File Handlers
  // -------------------

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (validateFile(selectedFile)) {
      resetState();
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (validateFile(droppedFile)) {
      resetState();
      setFile(droppedFile);
    }
  };

  const resetState = () => {
    setStatus("idle");
    setProgress(0);
    setDownloadUrl(null);
  };

  const removeFile = () => {
    setFile(null);
    resetState();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -------------------
  // 📌 Conversion Logic (Simulated)
  // -------------------

  const startConversion = () => {
    if (!file) return;

    setStatus("uploading");
    simulateProgress("converting");
  };

  const simulateProgress = (nextStep) => {
    let value = 0;

    const speed = nextStep === "converting" ? 6 : 10;

    const interval = setInterval(() => {
      value += Math.random() * speed;

      if (value >= 100) {
        clearInterval(interval);
        setProgress(100);

        if (nextStep === "converting") {
          setStatus("converting");
          simulateProgress("finish");
        } else {
          finishConversion();
        }
      } else {
        setProgress(value);
      }
    }, 180);
  };

  const finishConversion = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Converted Document</title>
        <style>
          body { font-family: Calibri, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>${file?.name || "Converted PDF"}</h1>
        <p><strong>Converted on:</strong> ${new Date().toLocaleString()}</p>
        <p>This is a simulated .doc file. Word can open & edit it normally.</p>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    setStatus("completed");
  };

  // -------------------
  // 📌 UI Components
  // -------------------

  const UploadSection = () => (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
        isDragging
          ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
          : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="bg-blue-100 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center">
        <Upload className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Drop your PDF here</h3>
      <p className="text-slate-500 mb-6">or click to browse</p>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto">
        <FileText className="h-4 w-4" />
        Select PDF File
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileSelect}
      />
    </div>
  );

  const ProgressBar = () => (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-slate-700">
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          {status === "uploading" ? "Uploading..." : "Converting..."}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">

    

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-3">PDF to Word Converter</h1>
          <p className="text-lg text-slate-600">
            Convert your PDF documents to editable Word files instantly.
          </p>
        </div>

        {/* Upload / Convert Box */}
        <div className="bg-white border rounded-2xl shadow-xl p-10">

          {!file ? (
            <UploadSection />
          ) : (
            <div className="space-y-6">

              {/* File Preview */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-red-500" />
                  </div>

                  <div>
                    <p className="font-semibold truncate">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatBytes(file.size)} • PDF Document
                    </p>
                  </div>
                </div>

                {status === "idle" && (
                  <button
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Action Area */}
              {status === "idle" && (
                <button
                  onClick={startConversion}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700"
                >
                  Convert to Word <ArrowRight />
                </button>
              )}

              {(status === "uploading" || status === "converting") && <ProgressBar />}

              {status === "completed" && (
                <div>
                  <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-700">Conversion Successful!</h3>
                    <p className="text-green-600 text-sm">Your Word document is ready.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <a
                      href={downloadUrl}
                      download={`converted-${file.name.replace(".pdf", "")}.doc`}
                      className="bg-slate-900 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" /> Download Word
                    </a>

                    <button
                      onClick={removeFile}
                      className="bg-white border py-3 rounded-lg hover:bg-slate-100"
                    >
                      Convert Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Row */}
          <div className="flex justify-center gap-6 text-xs mt-10 text-slate-500 uppercase tracking-wide">
            <FeatureTag text="Free Forever" />
            <FeatureTag text="Secure Encryption" />
            <FeatureTag text="High Quality" />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<File className="h-6 w-6 text-blue-600" />}
            title="Maintain Formatting"
            description="Preserves layout, fonts, spacing and images accurately."
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-6 w-6 text-blue-600" />}
            title="Fast Conversion"
            description="Lightning-fast performance with no waiting time."
          />
          <FeatureCard
            icon={<AlertCircle className="h-6 w-6 text-blue-600" />}
            title="Data Privacy"
            description="Your files are auto-deleted from servers within 1 hour."
          />
        </div>
      </main>

     
    </div>
  );
}

function FeatureTag({ text }) {
  return (
    <div className="flex items-center gap-1">
      <CheckCircle2 className="h-4 w-4 text-blue-500" />
      <span>{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm hover:shadow-md transition">
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  );
}
