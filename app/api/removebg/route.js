// app/api/removebg/route.js
export const runtime = "nodejs";

const REMOVE_BG_ENDPOINT = "https://api.remove.bg/v1.0/removebg";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "File missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "REMOVE_BG_API_KEY not configured in .env.local" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Build multipart/form-data for remove.bg
    const upstreamForm = new FormData();
    // The field name MUST be "image_file" for remove.bg
    upstreamForm.append("image_file", file);
    // size=auto gives best resolution allowed by your plan
    upstreamForm.append("size", "auto");

    const upstreamRes = await fetch(REMOVE_BG_ENDPOINT, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        // IMPORTANT: do NOT set Content-Type here, fetch will set boundary
      },
      body: upstreamForm,
    });

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text().catch(() => "");
      console.error("remove.bg error:", upstreamRes.status, text);

      return new Response(
        JSON.stringify({
          error: "Background removal failed",
          status: upstreamRes.status,
          details: text.slice(0, 4000),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // remove.bg returns the image binary directly
    const resultArrayBuffer = await upstreamRes.arrayBuffer();
    const resultBuffer = Buffer.from(resultArrayBuffer);

    return new Response(resultBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="no-bg.png"',
      },
    });
  } catch (err) {
    console.error("Server error in /api/removebg:", err);
    return new Response(
      JSON.stringify({ error: "Server error in removebg route" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
