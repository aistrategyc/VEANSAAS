import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

export const runtime = 'nodejs';
// (опц.) подсказываем Next не предварительно запускать модуль
export const dynamic = 'force-dynamic';

// --------------------------- Schema ---------------------------
const leadSchema = z.object({
  kind: z.enum(['demo', 'access', 'quote', 'contact']).default('contact'),
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  company: z.string().min(2, 'Company is too short'),
  phone: z.string().optional(),
  message: z.string().min(5, 'Message is too short'),
  plan: z.string().optional(),
  source: z.string().optional(),
  referrer: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

type Lead = z.infer<typeof leadSchema>;

// --------------------------- Config ---------------------------
const FROM = process.env.RESEND_FROM || 'Planerix <hello@planerix.com>';
const TO = (process.env.CONTACT_TO || 'kprolieiev@gmail.com')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const SUBJECTS: Record<Lead['kind'], (d: Lead) => string> = {
  demo:    (d) => `Demo request — ${d.company} (${d.name})`,
  access:  (d) => `Request access — ${d.company} (${d.name})`,
  quote:   (d) => `Pricing inquiry — ${d.company} (${d.name})`,
  contact: (d) => `Contact form — ${d.company} (${d.name})`,
};

const RECIPIENTS: Record<Lead['kind'], string[]> = {
  demo: TO,
  access: TO,
  quote: TO,
  contact: TO,
};

// --------------------------- Rate limit ---------------------------
const hits = new Map<string, { ts: number; count: number }>();
function ratelimit(ip: string, max = 15, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > windowMs) {
    hits.set(ip, { ts: now, count: 1 });
    return true;
  }
  if (rec.count >= max) return false;
  rec.count += 1;
  return true;
}

// --------------------------- Utils ---------------------------
function escapeHtml(str: string) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  }[m]!));
}

function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for')?.split(',')[0]?.trim())
    || (req.headers.get('x-real-ip') || '')
    || '0.0.0.0';
}

// --------------------------- Handler ---------------------------
export async function POST(req: Request) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  let json: unknown;
  try { json = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation error', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const ip = clientIp(req);
  if (!ratelimit(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
  }

  const ua = req.headers.get('user-agent') || undefined;
  const referer = req.headers.get('referer') || data.referrer || undefined;

  const subject = SUBJECTS[data.kind](data);
  const to = RECIPIENTS[data.kind];

  const utmLine = [
    data.utm_source && `utm_source=${escapeHtml(data.utm_source)}`,
    data.utm_medium && `utm_medium=${escapeHtml(data.utm_medium)}`,
    data.utm_campaign && `utm_campaign=${escapeHtml(data.utm_campaign)}`,
    data.utm_term && `utm_term=${escapeHtml(data.utm_term)}`,
    data.utm_content && `utm_content=${escapeHtml(data.utm_content)}`,
  ].filter(Boolean).join(' · ') || '—';

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto">
      <h2>${escapeHtml(subject)}</h2>
      <p><b>Kind:</b> ${escapeHtml(data.kind)}</p>
      <p><b>Name:</b> ${escapeHtml(data.name)}</p>
      <p><b>Email:</b> ${escapeHtml(data.email)}</p>
      <p><b>Company:</b> ${escapeHtml(data.company)}</p>
      ${data.phone ? `<p><b>Phone:</b> ${escapeHtml(data.phone)}</p>` : ''}
      ${data.plan ? `<p><b>Plan:</b> ${escapeHtml(data.plan)}</p>` : ''}
      <p><b>Message:</b></p>
      <pre style="white-space:pre-wrap">${escapeHtml(data.message)}</pre>
      <hr />
      <p><b>Source:</b> ${escapeHtml(data.source || 'unknown')}</p>
      ${referer ? `<p><b>Referrer:</b> ${escapeHtml(referer)}</p>` : ''}
      <p><b>UTM:</b> ${utmLine}</p>
      <p style="color:#666"><small>IP: ${escapeHtml(ip)} · UA: ${escapeHtml(ua || 'n/a')}</small></p>
    </div>
  `.trim();

  const text = [
    subject,
    `Kind: ${data.kind}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company}`,
    data.phone ? `Phone: ${data.phone}` : '',
    data.plan ? `Plan: ${data.plan}` : '',
    '',
    'Message:',
    data.message,
    '',
    `Source: ${data.source || 'unknown'}`,
    `Referrer: ${referer || 'n/a'}`,
    `UTM: ${utmLine.replace(/<[^>]+>/g, '')}`,
    `IP: ${ip}`,
    `UA: ${ua || 'n/a'}`,
  ].filter(Boolean).join('\n');

  const resend = new Resend(RESEND_API_KEY);
  const { data: sent, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    replyTo: data.email,
    html,
    text,
    tags: [{ name: 'route', value: 'lead' }, { name: 'kind', value: data.kind }],
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ ok: false, error: 'Email delivery failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: sent?.id ?? null });
}