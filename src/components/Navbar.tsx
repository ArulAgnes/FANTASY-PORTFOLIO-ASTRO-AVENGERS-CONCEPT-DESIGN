import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Terminal as TermIcon, Map as MapIcon, Clapperboard, Briefcase, X } from 'lucide-react';
import { useApp } from '../hooks/app';

const NAV = [
  ['ORIGIN', '#origin'],
  ['ARMORY', '#armory'],
  ['MISSIONS', '#missions'],
  ['BATTLEGROUND', '#battleground'],
  ['VAULT', '#vault'],
  ['ARCHIVE', '#knowledge'],
  ['CONTACT', '#contact'],
] as const;

export function Sigil({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="21" stroke="#ff7a1a" strokeWidth="1.6" opacity=".8" />
      <circle cx="24" cy="24" r="14" stroke="#41d9ff" strokeWidth="1" opacity=".55" strokeDasharray="4 5" style={{ animation: 'portalSpin 12s linear infinite', transformOrigin: 'center' }} />
      <path d="M24 12 L32 34 L24 29 L16 34 Z" fill="#e8eefb" opacity=".95" />
      <circle cx="24" cy="23" r="3" fill="#ff7a1a" />
    </svg>
  );
}

export default function Navbar() {
  const { sound, toggleSound, setTerminalOpen, setMapOpen, mode, setMode, scrollTo, sfx, booted } = useApp();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 500 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${hidden ? '-translate-y-full' : 'translate-y-0'} ${booted ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-3 px-4 py-3 md:px-8">
        {/* identity */}
        <button
          onClick={() => { scrollTo('#hero'); sfx('portal'); }}
          className="group flex items-center gap-3"
          aria-label="Back to top of the Agnesverse"
          data-cursor="link"
        >
          <Sigil />
          <span className="hidden text-left sm:block">
            <span className="block font-cinzel text-[.8rem] font-bold tracking-[.28em] text-white">AGNESVERSE</span>
            <span className="block font-mono text-[.5rem] tracking-[.34em] text-mist/50">ARUL MARIA AGNES I</span>
          </span>
        </button>

        {/* primary nav */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV.map(([label, href]) => (
            <button
              key={href}
              onClick={() => { scrollTo(href); sfx('click'); }}
              className="group relative font-mono text-[.58rem] tracking-[.3em] text-mist/70 transition-colors hover:text-white"
              data-cursor="link"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* controls */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <CtrlBtn label={sound ? 'SOUND ON' : 'SOUND OFF'} onClick={toggleSound} aria="Toggle sound">
            {sound ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span className="hidden xl:inline">{sound ? 'ON' : 'OFF'}</span>
          </CtrlBtn>
          <CtrlBtn label="WORLD MAP" onClick={() => setMapOpen(true)} aria="Open Agnesverse world map">
            <MapIcon size={13} />
            <span className="hidden xl:inline">MAP</span>
          </CtrlBtn>
          <CtrlBtn label="TERMINAL [`]" onClick={() => setTerminalOpen(true)} aria="Open developer terminal">
            <TermIcon size={13} />
            <span className="hidden xl:inline">TERM</span>
          </CtrlBtn>
          <button
            onClick={() => setMode(mode === 'cinematic' ? 'recruiter' : 'cinematic')}
            className="flex items-center gap-2 border border-ember/50 bg-ember/10 px-3 py-2 font-mono text-[.55rem] tracking-[.24em] text-ember2 transition-all hover:bg-ember/20 hover:shadow-[0_0_24px_-6px_rgba(255,122,26,.7)]"
            aria-label={mode === 'cinematic' ? 'Switch to recruiter mode' : 'Switch to cinematic mode'}
            data-cursor="link"
          >
            {mode === 'cinematic' ? <Briefcase size={13} /> : <Clapperboard size={13} />}
            <span className="hidden sm:inline">{mode === 'cinematic' ? 'RECRUITER' : 'CINEMATIC'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function CtrlBtn({ children, onClick, aria, label }: { children: React.ReactNode; onClick: () => void; aria: string; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={aria}
      data-cursor="link"
      className="flex items-center gap-2 border border-white/10 bg-white/[.03] px-3 py-2 font-mono text-[.55rem] tracking-[.24em] text-mist/80 transition-all hover:border-arc/50 hover:text-arc"
    >
      {children}
    </button>
  );
}

/* ================= WORLD MAP OVERLAY ================= */
const MAP_NODES: { id: string; label: string; sub: string; x: number; y: number }[] = [
  { id: '#origin', label: 'ORIGIN', sub: 'The Story', x: 12, y: 18 },
  { id: '#armory', label: 'POWER ARMORY', sub: 'Skills', x: 34, y: 8 },
  { id: '#missions', label: 'MISSION LOGS', sub: 'Experience', x: 62, y: 16 },
  { id: '#battleground', label: 'BATTLEGROUND', sub: 'Projects', x: 84, y: 8 },
  { id: '#threat', label: 'THREAT ZONE', sub: 'Legacy Bug', x: 56, y: 34 },
  { id: '#vault', label: 'CODE VAULT', sub: 'GitHub', x: 80, y: 46 },
  { id: '#knowledge', label: 'KNOWLEDGE ARCHIVE', sub: 'Education', x: 52, y: 60 },
  { id: '#credentials', label: 'CREDENTIAL VAULT', sub: 'Certifications', x: 22, y: 52 },
  { id: '#contact', label: 'CONTACT PORTAL', sub: 'Comms', x: 40, y: 86 },
  { id: '#finale', label: 'AGNES CORE', sub: 'Finale', x: 72, y: 84 },
];

export function WorldMap() {
  const { mapOpen, setMapOpen, scrollTo, sfx } = useApp();
  if (!mapOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-void/90 p-4 backdrop-blur-xl anim-rise" role="dialog" aria-modal="true" aria-label="Agnesverse world map" style={{ animationDuration: '.35s' }}>
      <div className="holo panel-clip relative h-[78vh] w-full max-w-5xl overflow-hidden p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-[.12]" style={{ backgroundImage: 'radial-gradient(rgba(65,217,255,.5) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="kicker mb-1">NAVIGATION GRID</p>
            <h3 className="font-display text-2xl tracking-wider text-white md:text-4xl">AGNESVERSE MAP</h3>
          </div>
          <button onClick={() => setMapOpen(false)} className="border border-white/15 p-2 text-mist transition-colors hover:border-ember hover:text-ember" aria-label="Close map" data-cursor="link" autoFocus>
            <X size={16} />
          </button>
        </div>

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline
            points={MAP_NODES.map((n) => `${n.x},${n.y}`).join(' ')}
            fill="none" stroke="rgba(255,122,26,.35)" strokeWidth=".35" strokeDasharray="1.4 1.6"
            style={{ animation: 'dashFlow 14s linear infinite' }}
          />
        </svg>

        {MAP_NODES.map((n, i) => (
          <button
            key={n.id}
            onClick={() => { scrollTo(n.id); setMapOpen(false); sfx('portal'); }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${n.x}%`, top: `${n.y}%`, animation: `riseIn .5s ${i * 60}ms both` }}
            data-cursor="portal"
          >
            <span className="mx-auto mb-2 block h-3 w-3 rotate-45 border border-ember bg-ember/20 transition-all duration-300 group-hover:scale-150 group-hover:bg-ember group-hover:shadow-[0_0_20px_rgba(255,122,26,.9)]" />
            <span className="block font-mono text-[.5rem] tracking-[.22em] text-white md:text-[.6rem]">{n.label}</span>
            <span className="block font-mono text-[.42rem] tracking-[.18em] text-mist/50 md:text-[.5rem]">{n.sub}</span>
          </button>
        ))}

        <div className="absolute bottom-5 left-6 font-mono text-[.5rem] tracking-[.3em] text-mist/40">
          SELECT A SECTOR — CAMERA WILL TRAVEL
        </div>
      </div>
    </div>
  );
}

/* ================= TOASTS ================= */
export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-[130] space-y-2" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`anim-rise flex items-center gap-3 border-l-2 px-4 py-2.5 font-mono text-[.6rem] tracking-[.3em] backdrop-blur-md ${
            t.tone === 'power' ? 'border-ember bg-ember/10 text-ember2' : t.tone === 'warn' ? 'border-red-400 bg-red-400/10 text-red-200' : 'border-arc bg-arc/10 text-arc'
          }`}
          style={{ animationDuration: '.35s' }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
