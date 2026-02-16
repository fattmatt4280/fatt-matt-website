import { Resend } from "npm:resend@4.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { subject, body, locations } = await req.json();

    if (!subject || !body || !locations || !Array.isArray(locations) || locations.length === 0) {
      return new Response(JSON.stringify({ error: 'subject, body, and locations are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Validate inputs
    if (subject.length > 200 || body.length > 10000) {
      return new Response(JSON.stringify({ error: 'Subject or body too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Use service role to fetch subscribers
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: subscribers, error: fetchError } = await serviceClient
      .from('location_registrations')
      .select('email, name, location')
      .in('location', locations);

    if (fetchError) throw fetchError;

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ error: 'No subscribers found for selected locations', sent: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Sending mass email to ${subscribers.length} subscribers`);

    // Send emails in batches of 50
    let sentCount = 0;
    let errorCount = 0;
    const batchSize = 50;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const promises = batch.map(async (sub) => {
        try {
          await resend.emails.send({
            from: 'FattMatt Tattoo <onboarding@resend.dev>',
            to: [sub.email],
            subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Hey ${sub.name}!</h2>
                <div style="font-size: 16px; line-height: 1.6; color: #555;">
                  ${body.replace(/\n/g, '<br>')}
                </div>
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
          sentCount++;
        } catch (err) {
          console.error(`Failed to send to ${sub.email}:`, err);
          errorCount++;
        }
      });
      await Promise.all(promises);
    }

    console.log(`Mass email complete: ${sentCount} sent, ${errorCount} failed`);

    return new Response(JSON.stringify({ success: true, sent: sentCount, failed: errorCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error sending mass email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
