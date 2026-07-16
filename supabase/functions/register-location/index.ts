import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Very small in-memory rate limiter (per warm instance)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const now = Date.now();
    const entry = hits.get(ip);
    if (entry && now - entry.ts < WINDOW_MS) {
      if (entry.count >= MAX_HITS) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      entry.count++;
    } else {
      hits.set(ip, { count: 1, ts: now });
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phoneRaw = body?.phone == null ? null : String(body.phone).trim();
    const phone = phoneRaw ? phoneRaw : null;
    const location = String(body?.location ?? "").trim();
    const honeypot = String(body?.website ?? ""); // hidden field, must be empty

    if (honeypot) {
      // Pretend success to spam bots
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (
      name.length < 1 || name.length > 200 ||
      email.length < 5 || email.length > 320 || !emailRe.test(email) ||
      location.length < 1 || location.length > 100 ||
      (phone !== null && phone.length > 40)
    ) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase
      .from("location_registrations")
      .insert({ name, email, phone, location });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Registration failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("register-location error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
