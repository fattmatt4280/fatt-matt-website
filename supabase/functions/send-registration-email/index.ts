import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOCATION_LABELS: Record<string, string> = {
  "montgomery-il": "Montgomery, IL",
  "portage-in": "Portage, IN",
  "clearwater-fl": "Clearwater, FL",
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, location } = await req.json();
    const locationLabel = LOCATION_LABELS[location] || location;

    console.log('Sending registration confirmation to:', email);

    await resend.emails.send({
      from: 'FattMatt Tattoo <onboarding@resend.dev>',
      to: [email],
      subject: "You're on the list! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hey ${name}, you're all set!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Thanks for signing up for updates at <strong>${locationLabel}</strong>. You'll be the first to hear about exclusive promos, flash deals, and travel dates near you.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Stay tuned — something awesome is coming your way soon.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              <strong>FattMatt</strong><br>
              Professional Tattoo Artist
            </p>
          </div>
        </div>
      `,
    });

    // Notify business too
    await resend.emails.send({
      from: 'FattMatt Tattoo <onboarding@resend.dev>',
      to: ['Fattmatt.me@gmail.com'],
      subject: `New subscriber: ${name} — ${locationLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Location Subscriber</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Location:</strong> ${locationLabel}</p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error sending registration email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
