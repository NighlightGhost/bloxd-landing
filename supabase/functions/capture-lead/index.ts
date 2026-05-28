import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Bloxd.io Guide <noreply@bloxdguide.online>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { name, email } = await req.json();
    if (!email) throw new Error('Email required');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Store lead (upsert so duplicates don't error)
    await supabase.from('leads').upsert({ name: name || '', email }, { onConflict: 'email' });

    // Send welcome email via Resend
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: `${name ? name + ', your' : 'Your'} free Bloxd.io guide is ready 🎮`,
        html: `
          <div style="font-family:Inter,sans-serif;background:#060912;color:#fff;padding:40px 24px;max-width:520px;margin:0 auto;border-radius:16px;">
            <div style="font-size:32px;margin-bottom:16px;">🏆</div>
            <h1 style="font-size:24px;font-weight:900;margin-bottom:12px;letter-spacing:-0.5px;">
              ${name ? `Welcome, ${name}!` : 'You\'re in!'}
            </h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin-bottom:24px;">
              You just unlocked free access to the Bloxd.io Guide — the AI tool that answers your questions instantly.
              PvP, parkour, UHC, SMP — ask anything.
            </p>
            <a href="https://bloxd-guide.vercel.app" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;margin-bottom:24px;">
              Open the Guide →
            </a>
            <p style="color:#475569;font-size:13px;line-height:1.6;">
              You get <strong style="color:#fff;">15 free questions</strong> to try it out. No credit card needed.<br/>
              Hit reply if you get stuck on anything — I read every email.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;" />
            <p style="color:#334155;font-size:12px;">
              Bloxd.io Guide · <a href="https://bloxdguide.online" style="color:#475569;">bloxdguide.online</a>
            </p>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
