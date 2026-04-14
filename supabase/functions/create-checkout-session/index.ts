import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICE_IDS: Record<string, string> = {
  'half-day': 'price_1SQUf0Rzfwe0oZX3bG0c8Q29',  // $100 — under 4hrs
  'full-day': 'price_1TLqIhDiBqghYX9ibQqhPr5b',   // $200 — full day
};

interface CheckoutRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  location: string;
  bodyLocation: string;
  consultType: string;
  sessionLength: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, location, bodyLocation, consultType, sessionLength }: CheckoutRequest = await req.json();

    console.log('Creating checkout session for:', { name, email, phone, consultType, sessionLength });

    const priceId = PRICE_IDS[sessionLength] || PRICE_IDS['half-day'];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/#booking`,
      customer_email: email,
      metadata: {
        name,
        email,
        phone,
        message,
        location,
        bodyLocation,
        consultType,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
