import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Bloxd.io Guide <noreply@bloxdguide.online>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const APP_URL = 'https://bloxdguide.online';

function wrap(content: string) {
  return `<div style="font-family:Inter,sans-serif;background:#04060f;padding:40px 24px;max-width:520px;margin:0 auto;"><div style="background:#0a0f1e;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:36px 32px;color:#fff;">${content}<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0 20px;"/><p style="color:#1e293b;font-size:11px;line-height:1.6;">Bloxd.io Guide · <a href="https://bloxdguide.online" style="color:#334155;">bloxdguide.online</a></p></div></div>`;
}

const EMAILS: Record<string, {subject:string; html:(n:string)=>string}[]> = {
  waitlist: [
    { subject: "You're in 🎮 — plus the #1 tip most Bloxd.io players ignore", html: () => '' }, // index 0 sent immediately
    {
      subject: "Why you keep losing in Bloxd.io PvP (it's not what you think)",
      html: (n) => wrap(`<p style="color:#64748b;font-size:13px;margin-bottom:20px;">Day 2 of your tips 👇</p><h1 style="font-size:20px;font-weight:900;letter-spacing:-0.5px;margin-bottom:14px;line-height:1.3;">The real reason most players lose every fight</h1><p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:18px;">${n?`${n}, here's`:'Here\'s'} something nobody tells you:</p><p style="color:#fff;font-size:15px;font-weight:700;line-height:1.7;margin-bottom:18px;">It's not your aim. It's your movement.</p><p style="color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:18px;">Most players stand still while swinging. The players who consistently win use <strong style="color:#fff;">W-tapping</strong> — briefly pressing forward between each hit to reset your sprint and deal more knockback.</p><div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:20px 22px;margin-bottom:20px;"><p style="color:#93c5fd;font-size:13px;font-weight:700;margin-bottom:8px;">⚡ How to W-tap:</p><ol style="color:#cbd5e1;font-size:14px;line-height:1.9;padding-left:18px;margin:0;"><li>Run at your opponent</li><li>Click to hit</li><li>Release W, then tap W again immediately</li><li>Hit again on the next swing</li><li>Repeat — each hit sends them further</li></ol></div><p style="color:#475569;font-size:13px;">More in 3 days — <em style="color:#64748b;">Nighlight</em></p>`)
    },
    {
      subject: "Sneak peek 👀 — here's what the Bloxd.io Guide actually does",
      html: (n) => wrap(`<p style="color:#64748b;font-size:13px;margin-bottom:20px;">Quick one today 👇</p><h1 style="font-size:20px;font-weight:900;letter-spacing:-0.5px;margin-bottom:14px;">Here's what you're about to get access to</h1><p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">${n?n+', the':'The'} Bloxd.io Guide is an AI expert you can ask anything, any time. Real questions people have asked:</p><div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;"><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;"><p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ How do I beat someone who keeps bridging away in UHC?</p><p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 Cut off their escape. Place blocks diagonally — they can't bridge sideways. Push. They'll run out of blocks or panic.</p></div><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;"><p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ What's the best technique for long parkour jumps?</p><p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 Sprint-jump at the very edge of the block, look slightly down mid-air. Extends your reach by almost half a block.</p></div><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;"><p style="color:#60a5fa;font-size:12px;font-weight:600;margin-bottom:6px;">❓ How do I protect my SMP base from raids?</p><p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">💬 Build a fake base 50 blocks away with mid-tier loot. Raiders find it, think they've won, leave. Your real base stays safe.</p></div></div><p style="color:#64748b;font-size:13px;line-height:1.7;margin-bottom:20px;">Your access drops in 2 days. Watch for it.</p><p style="color:#475569;font-size:13px;">— <em style="color:#64748b;">Nighlight</em></p>`)
    },
    {
      subject: "🔓 Your Bloxd.io Guide access is ready — claim it now",
      html: (n) => wrap(`<div style="font-size:40px;margin-bottom:16px;">🔓</div><h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin-bottom:12px;">${n?`${n}, your`:'Your'} early access is ready.</h1><p style="color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:20px;">You've been on the waitlist for a week. The guide is live — and as an early access member you get <strong style="color:#fff;">15 free questions</strong> to try it now. No card needed.</p><div style="text-align:center;margin-bottom:24px;"><a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;text-decoration:none;font-weight:800;font-size:16px;padding:15px 36px;border-radius:12px;">Open the Guide — it's free →</a></div><p style="color:#64748b;font-size:13px;line-height:1.7;margin-bottom:8px;">After your free questions, full access is <strong style="color:#94a3b8;">£3.99/month</strong> — cancel anytime.</p><p style="color:#475569;font-size:13px;">Go get better. — <em style="color:#64748b;">Nighlight</em></p>`)
    },
  ]
};

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const now = new Date().toISOString();

  const { data: due, error } = await supabase
    .from('email_queue')
    .select('*')
    .eq('sent', false)
    .lte('send_at', now)
    .limit(50);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!due?.length) return new Response(JSON.stringify({ sent: 0 }));

  let sent = 0;
  for (const row of due) {
    const seq = EMAILS[row.source] ?? EMAILS['waitlist'];
    const email = seq[row.sequence_index];
    if (!email) continue;
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM_EMAIL, to: row.email, subject: email.subject, html: email.html(row.name || '') }),
      });
      await supabase.from('email_queue').update({ sent: true, sent_at: new Date().toISOString() }).eq('id', row.id);
      sent++;
    } catch(e) { console.error('Failed to send to', row.email, e); }
  }

  return new Response(JSON.stringify({ sent }));
});
