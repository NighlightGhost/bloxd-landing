import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Bloxd.io Guide <noreply@bloxdguide.online>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const APP_URL = 'https://bloxd-guide.vercel.app';

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

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
}

function emailWrap(content: string) {
  return `<div style="font-family:Inter,sans-serif;background:#04060f;padding:40px 24px;max-width:520px;margin:0 auto;">
    <div style="background:#0a0f1e;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:36px 32px;color:#fff;">
      ${content}
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0 20px;" />
      <p style="color:#1e293b;font-size:11px;line-height:1.6;">
        Bloxd.io Guide · <a href="https://bloxdguide.online" style="color:#334155;">bloxdguide.online</a><br/>
        You're getting this because you joined the waitlist.<br/>
        <a href="*|UNSUBSCRIBE|*" style="color:#334155;">Unsubscribe</a>
      </p>
    </div>
  </div>`;
}

const SEQUENCES: Record<string, { subject: string; html: (name: string) => string }[]> = {
  waitlist: [
    // Email 1 — Immediate: Welcome + first tip
    {
      subject: "You're in 🎮 — plus the #1 tip most Bloxd.io players ignore",
      html: (name) => emailWrap(`
        <div style="font-size:36px;margin-bottom:16px;">🏆</div>
        <h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin-bottom:12px;">
          ${name ? `You're in, ${name}!` : "You're on the list!"}
        </h1>
        <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">
          Welcome to the Bloxd.io Guide waitlist. Early access is almost ready — 
          but while you wait, here's the one thing that separates good players from great ones:
        </p>
        <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px 22px;margin-bottom:20px;">
          <p style="color:#93c5fd;font-size:13px;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">⚡ Tip #1 — Aim for the body, not the head</p>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;">
            Most players aim at the head in PvP. The hitbox in Bloxd.io is actually more forgiving 
            on the upper chest — and targeting there keeps your crosshair stable when the enemy is strafing. 
            Try it in your next fight. You'll hit more consistently.
          </p>
        </div>
        <p style="color:#64748b;font-size:14px;line-height:1.7;margin-bottom:24px;">
          Over the next week I'll send you a few more tips like this — things most players 
          never figure out on their own. Then when the guide launches, you'll get first access.
        </p>
        <p style="color:#475569;font-size:13px;margin:0;">
          — Nighlight (your Bloxd.io guide)
        </p>
      `),
    },
    // Email 2 — Day 2: Why players keep losing
    {
      subject: "Why you keep losing in Bloxd.io PvP (it's not what you think)",
      html: (name) => emailWrap(`
        <p style="color:#64748b;font-size:13px;margin-bottom:20px;">Day 2 of your Bloxd.io tips 👇</p>
        <h1 style="font-size:20px;font-weight:900;letter-spacing:-0.5px;margin-bottom:14px;line-height:1.3;">
          The real reason most players lose every fight
        </h1>
        <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:18px;">
          ${name ? `${name}, here's` : "Here's"} something nobody tells you:
        </p>
        <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin-bottom:18px;">
          <strong style="color:#fff;">It's not your aim. It's your movement.</strong>
        </p>
        <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:18px;">
          In Bloxd.io PvP, most players stand still while swinging. That's free damage for your opponent. 
          The players who consistently win are doing something called <strong style="color:#fff;">W-tapping</strong> 
          — briefly pressing forward between each hit to reset your sprint and deal more knockback.
        </p>
        <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px 22px;margin-bottom:20px;">
          <p style="color:#93c5fd;font-size:13px;font-weight:700;margin-bottom:8px;">⚡ How to W-tap:</p>
          <ol style="color:#cbd5e1;font-size:14px;line-height:1.9;padding-left:18px;margin:0;">
            <li>Run at your opponent</li>
            <li>Click to hit</li>
            <li>Immediately release W, then tap W again</li>
            <li>Hit again on the next swing</li>
            <li>Repeat — each hit sends them flying further</li>
          </ol>
        </div>
        <p style="color:#64748b;font-size:13px;line-height:1.7;margin-bottom:20px;">
          Feels awkward at first. After 10 fights it'll be automatic. This one change will 
          make more difference than any new sword or armour.
        </p>
        <p style="color:#475569;font-size:13px;margin:0;">
          More tomorrow — <em style="color:#64748b;">Nighlight</em>
        </p>
      `),
    },
    // Email 3 — Day 5: Sneak peek of the guide
    {
      subject: "Sneak peek 👀 — here's what the guide actually does",
      html: (name) => emailWrap(`
        <p style="color:#64748b;font-size:13px;margin-bottom:20px;">Quick one today 👇</p>
        <h1 style="font-size:20px;font-weight:900;letter-spacing:-0.5px;margin-bottom:14px;line-height:1.3;">
          Here's what you're about to get access to
        </h1>
        <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">
          ${name ? `${name}, the` : "The"} Bloxd.io Guide is basically a Bloxd.io expert you can 
          ask anything, any time. Here are some real questions players have asked:
        </p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
          ${[
            ["How do I beat someone who keeps bridging away in UHC?", "Cut off their escape route. Place blocks diagonally so they can't bridge out to the side — then push. They'll run out of blocks or panic."],
            ["What's the best parkour technique for long jumps?", "Sprint-jump at the very edge of the block, look slightly down mid-air. The slight downward angle extends your horizontal reach by almost half a block."],
            ["How do I protect my SMP base from being raided?", "The most underrated protection is misdirection — build a fake base 50 blocks away with some mid-tier loot. Raiders find it, loot it, and think they've won."],
          ].map(([q, a]) => `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
              <p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ ${q}</p>
              <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 ${a}</p>
            </div>
          `).join('')}
        </div>
        <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:8px;">
          That's what the guide does. Instant answers to any Bloxd.io question — no more guessing, 
          no more getting rekt by players who figured it out before you.
        </p>
        <p style="color:#64748b;font-size:13px;line-height:1.7;margin-bottom:20px;">
          Your access drops in 2 days. Watch for it.
        </p>
        <p style="color:#475569;font-size:13px;margin:0;">
          — <em style="color:#64748b;">Nighlight</em>
        </p>
      `),
    },
    // Email 4 — Day 7: Access is ready
    {
      subject: "🔓 Your Bloxd.io Guide access is ready — claim it now",
      html: (name) => emailWrap(`
        <div style="font-size:40px;margin-bottom:16px;">🔓</div>
        <h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin-bottom:12px;">
          ${name ? `${name}, your` : "Your"} early access is ready.
        </h1>
        <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">
          You've been on the waitlist for a week. The guide is live — and as an early access 
          member you get <strong style="color:#fff;">15 free questions</strong> to try it right now. No card needed.
        </p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;text-decoration:none;font-weight:800;font-size:16px;padding:15px 36px;border-radius:12px;letter-spacing:-0.2px;">
            Open the Guide — it's free →
          </a>
        </div>
        <p style="color:#64748b;font-size:13px;line-height:1.7;margin-bottom:8px;">
          After your free questions, full access is <strong style="color:#94a3b8;">£3.99/month</strong> — 
          less than a pack of crisps. Cancel anytime.
        </p>
        <p style="color:#475569;font-size:13px;line-height:1.7;margin:0;">
          Go get better. — <em style="color:#64748b;">Nighlight</em>
        </p>
      `),
    },
  ],
};

const DELAYS: Record<string, number[]> = {
  waitlist: [0, 2, 5, 7], // days
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { name, email, source = 'waitlist' } = await req.json();
    if (!email) throw new Error('Email required');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Upsert lead with source tag
    const { error: upsertErr } = await supabase
      .from('leads')
      .upsert({ name: name || '', email, source, created_at: new Date().toISOString() }, { onConflict: 'email' });

    if (upsertErr) console.error('Upsert error:', upsertErr);

    const sequence = SEQUENCES[source] ?? SEQUENCES['waitlist'];
    const delays = DELAYS[source] ?? DELAYS['waitlist'];

    // Send first email immediately
    await sendEmail(email, sequence[0].subject, sequence[0].html(name || ''));

    // Schedule remaining emails via Supabase (store for cron to pick up)
    for (let i = 1; i < sequence.length; i++) {
      const sendAt = new Date();
      sendAt.setDate(sendAt.getDate() + delays[i]);
      await supabase.from('email_queue').insert({
        email,
        name: name || '',
        source,
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
