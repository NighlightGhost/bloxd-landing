import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Bloxd.io Guide <noreply@bloxdguide.online>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function wrap(content: string) {
  return `<div style="font-family:Inter,sans-serif;background:#04060f;padding:40px 24px;max-width:520px;margin:0 auto;"><div style="background:#0a0f1e;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:36px 32px;color:#fff;">${content}<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0 20px;"/><p style="color:#1e293b;font-size:11px;line-height:1.6;">Bloxd.io Guide · <a href="https://bloxdguide.online" style="color:#334155;">bloxdguide.online</a><br/>You're on the waitlist. <a href="" style="color:#334155;">Unsubscribe</a></p></div></div>`;
}

// 3-email nurture sequence — no "access ready" until launch day
const SEQUENCE = [
  {
    subject: "You're in 🎮 — plus the #1 tip most Bloxd.io players ignore",
    html: (name: string) => wrap(`
      <div style="font-size:36px;margin-bottom:16px;">🏆</div>
      <h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin-bottom:12px;">
        ${name ? `You're in, ${name}!` : "You're on the list!"}
      </h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">
        Welcome to the Bloxd.io Guide waitlist. While you wait for early access, 
        I'm going to send you a few tips that most players never figure out on their own.
      </p>
      <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px 22px;margin-bottom:20px;">
        <p style="color:#93c5fd;font-size:13px;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">⚡ Tip #1 — Aim for the body, not the head</p>
        <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;">
          Most players aim at the head in PvP. The hitbox in Bloxd.io is more forgiving 
          on the upper chest — and targeting there keeps your crosshair stable when the enemy 
          is strafing. Try it in your next fight. You'll land more hits.
        </p>
      </div>
      <p style="color:#64748b;font-size:14px;line-height:1.7;margin-bottom:24px;">
        More tips coming over the next few days. Watch for them.
      </p>
      <p style="color:#475569;font-size:13px;">— Nighlight</p>
    `),
  },
  {
    subject: "Why you keep losing in Bloxd.io PvP (it's not what you think)",
    html: (name: string) => wrap(`
      <p style="color:#64748b;font-size:13px;margin-bottom:20px;">Tip #2 👇</p>
      <h1 style="font-size:20px;font-weight:900;letter-spacing:-0.5px;margin-bottom:14px;line-height:1.3;">
        The real reason most players lose every fight
      </h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:18px;">
        ${name ? `${name}, here's` : "Here's"} something nobody tells you:
      </p>
      <p style="color:#fff;font-size:15px;font-weight:700;line-height:1.7;margin-bottom:18px;">
        It's not your aim. It's your movement.
      </p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:18px;">
        Most players stand still while swinging. The players who consistently win use 
        <strong style="color:#fff;">W-tapping</strong> — briefly pressing forward between 
        each hit to reset your sprint and deal more knockback.
      </p>
      <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px 22px;margin-bottom:20px;">
        <p style="color:#93c5fd;font-size:13px;font-weight:700;margin-bottom:8px;">⚡ How to W-tap:</p>
        <ol style="color:#cbd5e1;font-size:14px;line-height:1.9;padding-left:18px;margin:0;">
          <li>Run at your opponent</li>
          <li>Click to hit</li>
          <li>Release W, then tap W again immediately</li>
          <li>Hit on the next swing</li>
          <li>Repeat — each hit sends them further back</li>
        </ol>
      </div>
      <p style="color:#64748b;font-size:13px;line-height:1.7;">
        Feels awkward at first. After 10 fights it's automatic. — <em>Nighlight</em>
      </p>
    `),
  },
  {
    subject: "Sneak peek 👀 — here's what the Bloxd.io Guide actually does",
    html: (name: string) => wrap(`
      <p style="color:#64748b;font-size:13px;margin-bottom:20px;">Tip #3 — and a sneak peek 👇</p>
      <h1 style="font-size:20px;font-weight:900;letter-spacing:-0.5px;margin-bottom:14px;">
        Here's what you're going to get access to
      </h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">
        ${name ? `${name}, the` : "The"} Bloxd.io Guide is an AI you can ask any Bloxd.io 
        question — and get a real answer in seconds. Here's what that looks like:
      </p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
          <p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ How do I beat someone who keeps bridging away in UHC?</p>
          <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 Cut off their escape. Place blocks diagonally — they can't bridge sideways. Push hard. They'll run out of blocks or panic and fall.</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
          <p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ What's the best technique for long parkour jumps?</p>
          <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 Sprint-jump at the very edge of the block, look slightly down mid-air. Extends your reach by almost half a block.</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
          <p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ How do I protect my SMP base from raids?</p>
          <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 Build a fake base 50 blocks away with mid-tier loot. Raiders find it, think they've won, leave. Your real base stays untouched.</p>
        </div>
      </div>
      <p style="color:#64748b;font-size:13px;line-height:1.7;">
        That's what's coming. I'll let you know as soon as access opens. — <em>Nighlight</em>
      </p>
    `),
  },
];

// Delays in days for emails 1 and 2 (email 0 sent immediately)
const DELAYS = [0, 2, 5];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { name, email, source = 'waitlist' } = await req.json();
    if (!email) throw new Error('Email required');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Check for duplicate
    const { data: existing } = await supabase
      .from('leads')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existing) return json({ ok: true, duplicate: true });

    // Store lead
    await supabase.from('leads').insert({ name: name || '', email, source });

    // Send Email 1 immediately
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: email, subject: SEQUENCE[0].subject, html: SEQUENCE[0].html(name || '') }),
    });

    // Queue Emails 2 and 3
    for (let i = 1; i < SEQUENCE.length; i++) {
      const sendAt = new Date();
      sendAt.setDate(sendAt.getDate() + DELAYS[i]);
      await supabase.from('email_queue').insert({
        email, name: name || '', source,
        sequence_index: i,
        send_at: sendAt.toISOString(),
        sent: false,
      });
    }

    return json({ ok: true });
  } catch (err) {
    return json({ error: (err as Error).message }, 400);
  }
});
