// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Free Image Resizer, Compressor, Converter & Background Remover",
  description:
    "Free online tools to resize, compress, convert and remove background from images. Fast, secure, no signup.",
  keywords: [
    "image resizer",
    "image compressor",
    "background remover",
    "jpg to png",
    "photo tools",
    "reduce image size"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* body bg = #E9F7F7 */}
      <body className="min-h-screen bg-[#E9F7F7]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js')
            .then(function(reg) {
              console.log("Monetag SW registered:", reg.scope);
            })
            .catch(function(err) {
              console.error("SW registration failed:", err);
            });
        });
      }
    `,
          }} />
      </body>
    </html>
  );
}
//max-w-6xl mx-auto px-4 py-6
