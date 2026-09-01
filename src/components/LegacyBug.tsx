import { useEffect, useRef, useState } from 'react';
import { Bug, ShieldCheck, Swords, RotateCcw } from 'lucide-react';
import { useApp } from '../hooks/app';
import { Embers, SectionHeading } from './ui';
import MagneticButton from './MagneticButton';

const CORRUPTION = ['DB_CONN_FAIL', 'layout.broken', 'deploy === false', 'undefined is not a function', 'ERR_TOO_MANY_REDIRECTS', 'NaN% complete', '404: logic not found'];
const DEFENSES = ['PHP', 'MYSQL', 'JAVASCRIPT', 'GIT', 'DOCKER', 'PROBLEM SOLVING'];

/* INTERLUDE — the abstract digital antagonist. Not any copyrighted villain. */
export default function LegacyBug() {
  const { toast, sfx, reducedMotion } = useApp();
  const [stage, setStage] = useState(-1); // -1 idle · 0 threat · 1..6 defense firing · 7 resolved
  const [noise, setNoise] = useState(0);
  const running = useRef(false);
  const root = useRef<HTMLElement>(null);
  const seen = useRef(false);

  /* corruption ticker */
  useEffect(() => {
    if (stage === 7) return;
    const iv = window.setInterval(() => setNoise((n) => (n + 1) % CORRUPTION.length * 3), stage >= 0 ? 320 : 900);
    return () => window.clearInterval(iv);
  }, [stage]);

  /* auto-attack once, when first seen */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seen.current) {
        seen.current = true;
        window.setTimeout(() => attack(), 600);
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attack = () => {
    if (running.current) return;
    running.current = true;
    setStage(0);
    sfx('error');
    toast('THREAT DETECTED — THE LEGACY BUG', 'warn');
    if (reducedMotion) { setStage(7); running.current = false; return; }
    DEFENSES.forEach((d, i) => {
      window.setTimeout(() => {
        setStage(i + 1);
        sfx('power');
        toast(`${d} ENGAGED`, 'power');
        if (i === DEFENSES.length - 1) {
          window.setTimeout(() => {
            setStage(7);
            sfx('unlock');
            toast('BUG RESOLVED — SYSTEM INTEGRITY RESTORED', 'sys');
            running.current = false;
          }, 900);
        }
      }, 1100 + i * 850);
    });
  };

  const reset = () => { running.current = false; setStage(-1); };
  const resolved = stage === 7;
  const underAttack = stage >= 0 && !resolved;

  return (
    <section id="threat" ref={root} className="relative overflow-hidden px-4 py-24 md:px-10 md:py-36" aria-label="Interlude — the Legacy Bug">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,60,60,.06),transparent_55%)]" />
      <Embers count={6} hue="#ff5648" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          scene="INTERLUDE — SYSTEM THREAT"
          kicker="THE ABSTRACT ANTAGONIST"
          title="THE LEGACY"
          emberLine="BUG"
          right="Bugs, broken layouts, database errors, deployment failures — every developer's final boss. Watch the defense stack answer."
        />

        <div className={`holo panel-clip relative overflow-hidden transition-all duration-500 ${underAttack ? 'border-red-500/40' : resolved ? 'border-arc/40' : ''}`}>
          {/* status rail */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-5 py-3">
            <span className={`font-mono text-[.58rem] tracking-[.3em] ${resolved ? 'text-arc' : underAttack ? 'text-red-300 anim-flicker' : 'text-mist/60'}`}>
              {resolved ? 'STATUS: INTEGRITY RESTORED' : underAttack ? 'STATUS: UNDER ATTACK' : 'STATUS: DORMANT — AWAITING SIMULATION'}
            </span>
            <span className="flex items-center gap-1.5">
              {DEFENSES.map((_, i) => (
                <span key={i} className={`h-1 w-6 transition-all duration-300 ${stage > i && stage !== 7 ? 'bg-red-400/60' : stage > i || resolved ? 'bg-arc shadow-[0_0_8px_rgba(65,217,255,.8)]' : 'bg-white/10'}`} />
              ))}
            </span>
          </div>

          <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
            {/* ====== THE BUG ====== */}
            <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden border-b border-white/10 p-8 md:border-b-0 md:border-r">
              <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,60,60,.3), transparent 65%)', transform: resolved ? 'scale(0.4)' : 'scale(1)', transition: 'transform 1s' }} aria-hidden />
              <div
                className={`relative transition-all duration-700 ${resolved ? 'scale-50 opacity-25 grayscale' : ''} ${underAttack ? 'bug-shake' : ''}`}
              >
                <div className="relative grid h-32 w-32 place-items-center border border-red-500/60 bg-red-950/40 md:h-36 md:w-36" style={{ boxShadow: resolved ? 'none' : '0 0 70px -10px rgba(255,60,60,.6)', clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)' }}>
                  <Bug size={44} className="text-red-400" />
                  {/* glitch slices */}
                  {underAttack && (
                    <>
                      <span className="absolute inset-0 border border-red-400/50" style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-4px)', animation: 'bugGlitch .5s steps(2) infinite' }} aria-hidden />
                      <span className="absolute inset-0 border border-red-400/40" style={{ clipPath: 'inset(65% 0 10% 0)', transform: 'translateX(5px)', animation: 'bugGlitch .4s steps(2) infinite reverse' }} aria-hidden />
                    </>
                  )}
                </div>
                {/* tendrils */}
                {[-38, 0, 38].map((deg) => (
                  <span key={deg} className="absolute left-1/2 top-1/2 h-px w-16 origin-left bg-red-500/50 transition-all duration-700"
                    style={{ transform: `rotate(${deg}deg) scaleX(${resolved ? 0 : 1})` }} aria-hidden />
                ))}
              </div>
              <div className="relative mt-5 font-mono text-[.55rem] tracking-[.3em] text-red-300/90">THE LEGACY BUG</div>
              <div className="relative mt-2 h-4 font-mono text-[.48rem] tracking-[.2em] text-red-300/60" aria-live="off">
                {resolved ? 'corruption purged ✓' : (
                  <>
                    <span className="text-red-300/80">{CORRUPTION[noise % CORRUPTION.length]}</span>
                    <span className="mx-2 text-mist/30">·</span>
                    <span>{CORRUPTION[(noise + 2) % CORRUPTION.length]}</span>
                  </>
                )}
              </div>
            </div>

            {/* ====== BEAM ====== */}
            <div className="relative hidden w-16 items-center justify-center md:flex" aria-hidden>
              <span className="h-full w-px bg-white/5" />
              <span
                className="absolute h-full w-px transition-all duration-500"
                style={{
                  background: resolved ? 'linear-gradient(#41d9ff, transparent)' : underAttack ? 'linear-gradient(#ff6a5e, #ff7a1a)' : 'transparent',
                  boxShadow: underAttack || resolved ? '0 0 18px currentColor' : 'none',
                  color: resolved ? '#41d9ff' : '#ff7a1a',
                }}
              />
            </div>

            {/* ====== DEFENSE STACK ====== */}
            <div className="p-6 md:p-8">
              <div className="kicker kicker-ember mb-4">ARUL'S DEFENSE STACK</div>
              <div className="space-y-2">
                {DEFENSES.map((d, i) => {
                  const fired = stage > i;
                  const firing = stage === i + 1 && !resolved;
                  return (
                    <div
                      key={d}
                      className={`flex items-center justify-between border px-3.5 py-2.5 font-mono text-[.6rem] tracking-[.22em] transition-all duration-300 ${
                        firing ? 'border-ember bg-ember/15 text-ember2 shadow-[0_0_24px_-6px_rgba(255,122,26,.9)]'
                        : fired || resolved ? 'border-arc/40 bg-arc/5 text-arc'
                        : 'border-white/10 text-mist/50'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {fired || resolved ? <ShieldCheck size={13} /> : <Swords size={13} />}
                        {d}
                      </span>
                      <span className="text-[.48rem] tracking-[.3em]">{firing ? 'FIRING…' : fired || resolved ? 'DEPLOYED ✓' : 'READY'}</span>
                    </div>
                  );
                })}
              </div>

              {resolved && (
                <div className="anim-rise mt-5 border border-arc/50 bg-arc/10 p-4 text-center" style={{ boxShadow: '0 0 50px -12px rgba(65,217,255,.7)' }}>
                  <div className="font-display text-2xl tracking-wider text-arc text-glow-arc">BUG RESOLVED</div>
                  <div className="mt-1 font-mono text-[.5rem] tracking-[.3em] text-mist">PROBLEM SOLVING — THE REAL SUPERPOWER</div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <MagneticButton small variant="ember" icon={<Swords size={11} />} onClick={attack}>
                  {stage === -1 ? 'Simulate Attack' : 'Re-Run Simulation'}
                </MagneticButton>
                {stage !== -1 && !resolved && (
                  <MagneticButton small variant="ghost" icon={<RotateCcw size={11} />} onClick={reset}>Abort</MagneticButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bug-shake { animation: bugShake .28s linear infinite; }
        @keyframes bugShake { 0%,100% { transform: translate(0,0) rotate(0);} 25% { transform: translate(1.5px,-1px) rotate(.6deg);} 50% { transform: translate(-1.5px,1px) rotate(-.6deg);} 75% { transform: translate(1px,1.5px) rotate(.4deg);} }
        @keyframes bugGlitch { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
      `}</style>
    </section>
  );
}
