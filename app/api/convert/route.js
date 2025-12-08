export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const target = form.get("target"); // pdf or docx

    if (!file) {
      return new Response(JSON.stringify({ error: "File missing" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filename = file.name;

    // API endpoint (free, no key required)
    const endpoint =
      target === "docx"
        ? "https://api.pdf.co/v1/pdf/convert/to/doc"
        : "https://api.pdf.co/v1/pdf/convert/to/pdf";

    const apiKey = "free"; // no signup required

    const body = new FormData();
    body.append("file", new Blob([arrayBuffer]), filename);
    body.append("name", `converted.${target}`);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body,
    });

    const data = await res.json();

    if (!data.success) {
      console.error("PDF.co failed:", data);
      return new Response(
        JSON.stringify({ error: "Conversion failed", details: data.message }),
        { status: 500 }
      );
    }

    // Download final file
    const output = await fetch(data.url);
    const blob = await output.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type":
          target === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });
  } catch (e) {
    console.error("SERVER CRASH:", e);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
