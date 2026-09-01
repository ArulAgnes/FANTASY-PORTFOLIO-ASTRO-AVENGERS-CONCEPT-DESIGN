import { useEffect, useRef, useState } from 'react';
import { useApp } from '../hooks/app';

const BOOT_LINES = ['SYSTEM BOOT', 'CODE CORE', 'DATABASE CORE', 'WEB CORE', 'PROJECT CORE'];

export default function Preloader() {
  const { setBooted, reducedMotion, sfx } = useApp();
  const [pct, setPct] = useState(0);
  const [lines, setLines] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'name' | 'exit'>('boot');
  const [gone, setGone] = useState(false);
  const name = 'ARUL MARIA AGNES I';
  const done = useRef(false);

  useEffect(() => {
    const speed = reducedMotion ? 6 : 1;
    let p = 0;
    const iv = window.setInterval(() => {
      p += Math.random() * 9 + 3;
      if (p >= 100) { p = 100; window.clearInterval(iv); }
      setPct(Math.floor(p));
    }, 150 / speed);
    return () => window.clearInterval(iv);
  }, [reducedMotion]);

  useEffect(() => {
    if (pct >= 100 && lines < BOOT_LINES.length) {
      const t = window.setTimeout(() => {
        setLines((l) => l + 1);
        sfx('click');
      }, reducedMotion ? 60 : 260);
      return () => window.clearTimeout(t);
    }
    if (lines === BOOT_LINES.length && phase === 'boot') {
      const t = window.setTimeout(() => { setPhase('name'); sfx('power'); }, reducedMotion ? 120 : 550);
      return () => window.clearTimeout(t);
    }
  }, [pct, lines, phase, reducedMotion, sfx]);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setPhase('exit');
    window.setTimeout(() => { setGone(true); setBooted(true); }, reducedMotion ? 100 : 900);
  };

  useEffect(() => {
    if (phase === 'name') {
      const t = window.setTimeout(finish, reducedMotion ? 300 : 2400);
      return () => window.clearTimeout(t);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void transition-all duration-700 ${phase === 'exit' ? 'opacity-0 scale-110' : 'opacity-100'}`}
      role="status"
      aria-label="Loading the Agnesverse"
    >
      {/* heartbeat core */}
      <div className="relative mb-10 h-40 w-40">
        <div className="absolute inset-0 rounded-full border border-ember/25" style={{ animation: 'pulseCore 1.6s ease-in-out infinite' }} />
        <div className="absolute inset-4 rounded-full border border-arc/20" style={{ animation: 'pulseCore 1.6s ease-in-out .25s infinite' }} />
        <div className="absolute inset-9 rounded-full bg-gradient-to-br from-ember/70 to-arc/50 blur-[2px]" style={{ animation: 'pulseCore .9s ease-in-out infinite', boxShadow: '0 0 60px rgba(255,122,26,.6)' }} />
        <div className="absolute inset-0 rounded-full border-t-2 border-ember/80" style={{ animation: 'spin 3s linear infinite' }} />
      </div>

      {phase === 'boot' && (
        <div className="w-72 text-center">
          <p className="kicker kicker-ember mb-6 anim-flicker">INITIALIZING AGNESVERSE…</p>
          <div className="mb-6 font-mono text-[.62rem] tracking-[.3em] text-mist/50">CORE CHARGE — {pct}%</div>
          <div className="space-y-2 text-left">
            {BOOT_LINES.slice(0, lines).map((l, i) => (
              <div key={l} className="flex items-center justify-between font-mono text-[.62rem] tracking-[.28em] text-mist anim-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <span>{l}</span>
                <span className="text-arc">ONLINE</span>
              </div>
            ))}
            {lines < BOOT_LINES.length && (
              <div className="font-mono text-[.62rem] tracking-[.28em] text-mist/40">
                <span className="term-caret">▮</span>
              </div>
            )}
          </div>
          <button
            onClick={finish}
            className="mt-8 font-mono text-[.55rem] tracking-[.4em] text-mist/40 transition-colors hover:text-arc"
          >
            [ SKIP PROTOCOL ]
          </button>
        </div>
      )}

      {phase !== 'boot' && (
        <div className="text-center">
          <p className="kicker mb-4">SYSTEM ONLINE</p>
          <h1 className="font-display text-[clamp(1.8rem,6vw,4.6rem)] tracking-wider text-white">
            {name.split('').map((c, i) => (
              <span
                key={i}
                className="inline-block anim-rise"
                style={{ animationDelay: `${i * 45}ms`, animationDuration: '.55s' }}
              >
                {c === ' ' ? '\u00A0' : c}
              </span>
            ))}
          </h1>
          <div className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-ember to-transparent" />
        </div>
      )}
    </div>
  );
}
