// app/page.jsx
import Link from "next/link";

export default function HomePage() {
  const tools = [
    {
      href: "/tools/resize-compress",
      title: "Image Resizer",
      desc: "Resize, crop, and compress images for web, exams, and printing.",
      icon: "↔️",
    },
    {
      href: "/tools/resize-compress",
      title: "Image Compressor",
      desc: "Reduce file size to exact KB / MB without visible quality loss.",
      icon: "📉",
    },
    {
      href: "/tools/removebg",
      title: "Background Remover",
      desc: "Remove backgrounds in seconds using AI. Export clean PNGs.",
      icon: "🪄",
    },
    {
      href: "/tools/convert",
      title: "Format Converter",
      desc: "Convert between JPG, PNG, WEBP and more in one click.",
      icon: "🔁",
    },
  ];

  return (
    <main className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-6 py-12 md:px-12 md:py-16 shadow-sm">
        {/* soft blur background circle */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-sky-100 bg-white/80 px-3 py-1 text-xs font-medium text-sky-700 shadow-sm mb-4">
            <span className="mr-1.5 text-base">✨</span>
            <span>Free Tools · No Sign Up Required</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Professional Image
            <span className="block text-sky-500">Tools resizeme</span>
            <span className="block">in Your Browser</span>
          </h1>

          <p className="mt-4 text-sm text-slate-600 md:text-base">
            Resize, compress, convert and edit images instantly. No installation, no account.
            All processing happens securely inside your browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools/resize-compress"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-700 transition"
            >
              Start Editing Free
              <span className="ml-2 text-base">➜</span>
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 hover:border-sky-300 hover:text-sky-700 transition"
            >
              View All Tools
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              100% Free
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              No Upload to Servers
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Privacy Focused
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section id="tools" className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Powerful Tools for Every Need
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            All the tools you need to work with images, completely free and private.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}                 // 👈 use title (or href+title) as key
              href={tool.href}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-xl">
                {tool.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-500">{tool.desc}</p>
            </Link>
          ))}

        </div>
      </section>

      {/* SIMPLE FOOTER STRIP (inside page container) */}
      <section className="border-t border-slate-200 pt-6 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} resizeme. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </section>
    </main>
  );
}
