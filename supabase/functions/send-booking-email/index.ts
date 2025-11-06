import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  name: string;
  email: string;
  message: string;
  location: string;
  consultType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, location, consultType }: BookingRequest = await req.json();
    
    console.log('Processing booking request:', { name, email, location, consultType });

    // Send notification email to business
    const businessEmailResponse = await resend.emails.send({
      from: 'FattMatt Tattoo <onboarding@resend.dev>',
      to: ['Fattmatt.me@gmail.com'],
      subject: `New ${consultType} Booking Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0EA5E9; padding-bottom: 10px;">
            New Booking Request
          </h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Consultation Type:</strong> ${consultType}</p>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Preferred Location:</strong> ${location}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message / Tattoo Idea:</h3>
            <p style="background-color: #fff; padding: 15px; border-left: 4px solid #0EA5E9; margin: 10px 0;">
              ${message}
            </p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Received at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
          </p>
        </div>
      `,
    });

    console.log('Business email sent:', businessEmailResponse);

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: 'FattMatt Tattoo <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Booking Request Has Been Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Booking Request, ${name}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            We've received your ${consultType.toLowerCase()} request and are excited to bring your tattoo vision to life.
          </p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Request Details:</h3>
            <p style="margin: 10px 0;"><strong>Preferred Location:</strong> ${location}</p>
            <p style="margin: 10px 0;"><strong>Consultation Type:</strong> ${consultType}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            I'll review your request and get back to you as soon as possible. If you have any questions in the meantime, 
            feel free to reach out at <a href="mailto:Fattmatt.me@gmail.com" style="color: #0EA5E9;">Fattmatt.me@gmail.com</a>.
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

    console.log('Customer confirmation email sent:', customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Booking request sent successfully' 
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-booking-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
