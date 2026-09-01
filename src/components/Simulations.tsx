import { useEffect, useMemo, useState } from 'react';
import { BookOpen, MousePointerClick, CreditCard, MailCheck, Database, HeartHandshake, RotateCcw, Play, Pause, ChevronLeft, ChevronRight, Calculator, FileText, Plus, Trash2, Printer } from 'lucide-react';
import MagneticButton from './MagneticButton';

/* =========================================================
   All simulations are clearly labeled portfolio simulations.
   They demonstrate documented workflows — they are NOT the
   deployed applications.
   ========================================================= */

export function SimBadge() {
  return (
    <div className="mb-4 inline-flex items-center gap-2 border border-gild/40 bg-gild/10 px-3 py-1.5 font-mono text-[.55rem] tracking-[.26em] text-gild">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gild" />
      SIMULATION — NOT A LIVE PRODUCTION SYSTEM
    </div>
  );
}

/* ---------------- BOOKBAZZAR ---------------- */
const BB_STEPS = [
  { icon: BookOpen, title: 'BOOK APPEARS', body: 'A refurbished book enters the marketplace — title, condition and price registered in inventory.' },
  { icon: MousePointerClick, title: 'USER SELECTS', body: 'A reader browses the stalls and selects a book. Buy — or donate. Both doors stay open.' },
  { icon: CreditCard, title: 'TRANSACTION BEGINS', body: 'The order fires through the PHP backend. Role-based access separates Admin and User lanes.' },
  { icon: MailCheck, title: 'EMAIL NOTIFICATION', body: 'PHP Mailer dispatches an order confirmation — and donation alerts when books are gifted.' },
  { icon: Database, title: 'INVENTORY UPDATES', body: 'MySQL commits the change: stock decrements, order logged, records stay consistent.' },
  { icon: HeartHandshake, title: 'DONATION PORTAL OPENS', body: 'The donation workflow activates — a book finds a new reader through the donation center.' },
];

export function BookBazzarSim() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const stock = 128 - (step >= 4 ? 1 : 0);

  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % BB_STEPS.length), 2800);
    return () => window.clearInterval(t);
  }, [auto]);

  const S = BB_STEPS[step];
  const Icon = S.icon;

  return (
    <div>
      <SimBadge />
      {/* stage */}
      <div className="relative mb-5 grid min-h-[190px] place-items-center overflow-hidden border border-white/10 bg-black/40 p-6">
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,178,94,.35), transparent 55%), radial-gradient(circle at 75% 80%, rgba(65,217,255,.25), transparent 55%)' }} aria-hidden />
        <div key={step} className="anim-rise relative text-center" style={{ animationDuration: '.45s' }}>
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border border-ember/50 bg-ember/10" style={{ boxShadow: '0 0 50px -10px rgba(255,122,26,.8)' }}>
            <Icon size={30} className="text-ember2" />
          </div>
          <div className="font-display text-2xl tracking-wider text-white">{S.title}</div>
          <p className="mx-auto mt-2 max-w-sm text-[.74rem] leading-relaxed text-mist/85">{S.body}</p>
          {step >= 3 && step < 5 && (
            <div className="mx-auto mt-3 w-fit border border-arc/40 bg-arc/10 px-3 py-1 font-mono text-[.52rem] tracking-[.24em] text-arc mail-fly">
              PHP MAILER → CONFIRMATION SENT ✓
            </div>
          )}
          {step === 4 && (
            <div className="mx-auto mt-3 w-fit border border-white/15 bg-white/5 px-3 py-1 font-mono text-[.52rem] tracking-[.24em] text-mist">
              MySQL · STOCK: <span className="text-ember2">128</span> → <span className="text-arc">{stock}</span>
            </div>
          )}
          {step === 5 && (
            <div className="mx-auto mt-3 flex w-fit gap-2 font-mono text-[.52rem] tracking-[.24em]">
              <span className="border border-gild/40 bg-gild/10 px-3 py-1 text-gild">DONATION ALERT ✓</span>
              <span className="border border-arc/40 bg-arc/10 px-3 py-1 text-arc">BOOK DONATED</span>
            </div>
          )}
        </div>
        {/* progress rail */}
        <div className="absolute inset-x-6 bottom-4 flex items-center gap-1.5">
          {BB_STEPS.map((_, i) => (
            <button key={i} onClick={() => { setStep(i); setAuto(false); }} aria-label={`Go to step ${i + 1}`}
              className={`h-1 flex-1 transition-all duration-500 ${i <= step ? 'bg-ember shadow-[0_0_8px_rgba(255,122,26,.8)]' : 'bg-white/10'}`} />
          ))}
        </div>
        <style>{`@keyframes mailGo { from { transform: translateX(-8px); opacity: 0;} to { transform: translateX(0); opacity: 1;} } .mail-fly { animation: mailGo .5s ease-out both; }`}</style>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MagneticButton small variant="ghost" icon={<ChevronLeft size={11} />} onClick={() => { setStep((s) => (s - 1 + BB_STEPS.length) % BB_STEPS.length); setAuto(false); }}>Prev</MagneticButton>
        <MagneticButton small variant={auto ? 'ember' : 'arc'} icon={auto ? <Pause size={11} /> : <Play size={11} />} onClick={() => setAuto((a) => !a)}>{auto ? 'Pause' : 'Auto-Play'}</MagneticButton>
        <MagneticButton small variant="ghost" icon={<ChevronRight size={11} />} onClick={() => { setStep((s) => (s + 1) % BB_STEPS.length); setAuto(false); }}>Next</MagneticButton>
        <MagneticButton small variant="ghost" icon={<RotateCcw size={11} />} onClick={() => { setStep(0); setAuto(true); }}>Reset</MagneticButton>
      </div>
    </div>
  );
}

/* ---------------- ASTROLOGY (real math, labeled demo) ---------------- */
const digitReduce = (n: number): number => { while (n > 9) n = String(n).split('').reduce((a, c) => a + Number(c), 0); return n; };
const sumDigits = (s: string) => s.replace(/\D/g, '').split('').reduce((a, c) => a + Number(c), 0);
const lifePath = (dob: string) => digitReduce(sumDigits(dob));
const luckyFrom = (dob: string) => digitReduce(Number(dob.slice(8, 10)) * Number(dob.slice(5, 7)) + digitReduce(Number(dob.slice(0, 4))));

export function AstrologySim() {
  const [dob, setDob] = useState('');
  const [dob2, setDob2] = useState('');
  const [res, setRes] = useState<{ lp: number; lucky: number; compat: number | null } | null>(null);

  const calc = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return;
    const lp = lifePath(dob);
    const lucky = luckyFrom(dob);
    const compat = /^\d{4}-\d{2}-\d{2}$/.test(dob2)
      ? Math.max(58, Math.min(99, 99 - Math.abs(lifePath(dob2) - lp) * 5 - Math.abs(luckyFrom(dob2) - lucky)))
      : null;
    setRes({ lp, lucky, compat });
  };

  return (
    <div>
      <SimBadge />
      <p className="mb-2 -mt-2 font-mono text-[.52rem] tracking-[.22em] text-mist/50">
        Numerology logic ported from the project — <span className="text-gild">DEMO CALCULATION · entertainment, not science</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="kicker mb-1.5 block">DATE OF BIRTH</span>
          <input type="date" value={dob} onChange={(e) => { setDob(e.target.value); setRes(null); }}
            className="w-full border border-vio/40 bg-black/50 px-3 py-2.5 font-mono text-sm text-white outline-none focus:border-vio [color-scheme:dark]" />
        </label>
        <label className="block">
          <span className="kicker mb-1.5 block">PARTNER DOB (OPTIONAL)</span>
          <input type="date" value={dob2} onChange={(e) => { setDob2(e.target.value); setRes(null); }}
            className="w-full border border-white/15 bg-black/50 px-3 py-2.5 font-mono text-sm text-white outline-none focus:border-vio [color-scheme:dark]" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <MagneticButton small variant="ember" icon={<Calculator size={11} />} onClick={calc}>Calculate</MagneticButton>
        <MagneticButton small variant="ghost" icon={<RotateCcw size={11} />} onClick={() => { setDob(''); setDob2(''); setRes(null); }}>Reset</MagneticButton>
      </div>

      {res && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { k: 'LIFE PATH NUMBER', v: res.lp, hue: '#8a6bff' },
            { k: 'LUCKY NUMBER', v: res.lucky, hue: '#ffe259' },
            { k: 'COMPATIBILITY', v: res.compat === null ? '—' : `${res.compat}%`, hue: '#41d9ff' },
          ].map((r, i) => (
            <div key={r.k} className="anim-rise relative overflow-hidden border bg-black/40 p-4 text-center" style={{ borderColor: `${r.hue}55`, animationDelay: `${i * 120}ms` }}>
              <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 0%, ${r.hue}, transparent 70%)` }} aria-hidden />
              <div className="relative font-display text-4xl" style={{ color: r.hue, textShadow: `0 0 24px ${r.hue}88` }}>{r.v}</div>
              <div className="relative mt-1 font-mono text-[.5rem] tracking-[.26em] text-mist">{r.k}</div>
            </div>
          ))}
          <div className="sm:col-span-3 border border-white/10 bg-white/[.02] px-3 py-2 font-mono text-[.52rem] tracking-[.2em] text-mist/60">
            PIPELINE: DOB INPUT → JAVASCRIPT DOM VALIDATION → PHP-STYLE NUMEROLOGY REDUCTION → ANIMATED RESULT INTERFACE
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- PHARMACY BILLING ---------------- */
interface Med { name: string; price: number; }
const SAMPLE_MEDS: Med[] = [
  { name: 'Paracetamol 500mg', price: 12 },
  { name: 'Amoxicillin 250mg', price: 48 },
  { name: 'Cetirizine 10mg', price: 9 },
  { name: 'Vitamin C 500mg', price: 32 },
  { name: 'ORS Sachet', price: 18 },
];
interface Line { med: Med; qty: number; }

export function PharmacySim() {
  const [customer, setCustomer] = useState('');
  const [medIdx, setMedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [lines, setLines] = useState<Line[]>([]);
  const [invoice, setInvoice] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const total = useMemo(() => lines.reduce((a, l) => a + l.med.price * l.qty, 0), [lines]);

  const addLine = () => {
    const med = SAMPLE_MEDS[medIdx];
    setLines((ls) => {
      const ex = ls.find((l) => l.med.name === med.name);
      if (ex) return ls.map((l) => (l.med.name === med.name ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...ls, { med, qty }];
    });
  };

  const generate = () => {
    if (!lines.length) return;
    const no = (invoice || 0) + 1;
    setInvoice(no);
    setLog((l) => [`TXN-${String(no).padStart(3, '0')} · ${customer || 'WALK-IN'} · ₹${total} · PDF VIA FPDF ✓`, ...l].slice(0, 4));
  };

  return (
    <div>
      <SimBadge />
      <p className="mb-3 -mt-2 font-mono text-[.52rem] tracking-[.22em] text-mist/50">SAMPLE INVENTORY · prices are placeholder demo values</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="CUSTOMER NAME"
          className="border border-white/15 bg-black/50 px-3 py-2.5 font-mono text-[.68rem] tracking-[.14em] text-white outline-none focus:border-arc placeholder:text-mist/40" />
        <select value={medIdx} onChange={(e) => setMedIdx(Number(e.target.value))} aria-label="Select medicine"
          className="border border-white/15 bg-black/60 px-3 py-2.5 font-mono text-[.68rem] text-white outline-none focus:border-arc">
          {SAMPLE_MEDS.map((m, i) => <option key={m.name} value={i}>{m.name} — ₹{m.price}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input type="number" min={1} max={99} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} aria-label="Quantity"
            className="w-16 border border-white/15 bg-black/50 px-2 py-2.5 text-center font-mono text-[.68rem] text-white outline-none focus:border-arc" />
          <MagneticButton small variant="arc" icon={<Plus size={11} />} onClick={addLine}>Add</MagneticButton>
        </div>
      </div>

      {lines.length > 0 && (
        <div className="mt-4 overflow-hidden border border-white/10">
          {lines.map((l) => (
            <div key={l.med.name} className="flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-2 font-mono text-[.64rem] tracking-[.1em]">
              <span className="text-white">{l.med.name}</span>
              <span className="text-mist">×{l.qty}</span>
              <span className="text-arc">₹{l.med.price * l.qty}</span>
              <button onClick={() => setLines((ls) => ls.filter((x) => x.med.name !== l.med.name))} aria-label={`Remove ${l.med.name}`} className="text-mist/40 hover:text-red-300" data-cursor="link">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between bg-ember/10 px-4 py-2.5 font-mono text-[.68rem] tracking-[.2em]">
            <span className="text-ember2">TOTAL</span>
            <span className="text-ember2">₹{total}</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <MagneticButton small variant="ember" icon={<Printer size={11} />} onClick={generate}>Generate PDF Bill (FPDF)</MagneticButton>
        <MagneticButton small variant="ghost" icon={<RotateCcw size={11} />} onClick={() => { setLines([]); setInvoice(null); setLog([]); setCustomer(''); }}>Reset</MagneticButton>
      </div>

      {invoice && (
        <div className="anim-rise mt-5 border border-arc/40 bg-arc/5 p-5" style={{ boxShadow: '0 0 40px -12px rgba(65,217,255,.6)' }}>
          <div className="mb-2 flex items-center gap-2 font-display text-xl tracking-wider text-arc">
            <FileText size={17} /> PDF BILL GENERATED
          </div>
          <div className="font-mono text-[.6rem] tracking-[.16em] text-mist">
            INVOICE #INV-{String(invoice).padStart(4, '0')} · CUSTOMER: {customer || 'WALK-IN'} · LINES: {lines.length} · TOTAL ₹{total}
          </div>
          <div className="mt-2 font-mono text-[.5rem] tracking-[.2em] text-mist/50">
            THE PRODUCTION SYSTEM RENDERS A REAL PDF THROUGH FPDF · THIS HOLOGRAM IS A VISUAL STAND-IN
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="mt-4">
          <div className="kicker mb-2">TRANSACTION HISTORY</div>
          <div className="space-y-1">
            {log.map((l) => <div key={l} className="border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[.55rem] tracking-[.14em] text-mist/80">{l}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
