import { useEffect, useRef, useState } from 'react';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers } from './ui';
import CoreVisual from './CoreVisual';
import { SKILLS, SKILL_COMBOS } from '../data/resume';

export default function PowerArmory() {
  const { openSkill, isMobile, reducedMotion, skillId, toast, unlockDevMode, sfx } = useApp();
  const orbitRef = useRef<HTMLDivElement>(null);
  const rot = useRef(0);
  const vel = useRef(0.05);
  const paused = useRef(false);
  const [coreClicks, setCoreClicks] = useState(0);
  const seenRef = useRef(false);

  /* announce + toast once visible */
  useEffect(() => {
    const el = document.getElementById('armory');
    if (!el || seenRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seenRef.current) {
        seenRef.current = true;
        toast('POWER ARMORY ONLINE', 'power');
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [toast]);

  /* orbiting cores (desktop) */
  useEffect(() => {
    if (isMobile || !orbitRef.current) return;
    const wrap = orbitRef.current;
    const items = Array.from(wrap.querySelectorAll<HTMLElement>('[data-orb]'));
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!paused.current && !skillId && !reducedMotion) rot.current += vel.current * dt * 60;
      const rect = wrap.getBoundingClientRect();
      const rx = rect.width * 0.44;
      const ry = rect.height * 0.33;
      const n = items.length;
      items.forEach((el, i) => {
        const a = ((i / n) * 360 + rot.current) * (Math.PI / 180);
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry + Math.sin(now / 900 + i) * 5;
        const depth = Math.sin(a); // -1 back … 1 front
        const scale = 0.68 + 0.38 * ((depth + 1) / 2);
        el.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        el.style.zIndex = String(Math.round(50 + depth * 40));
        el.style.opacity = String(0.4 + 0.6 * ((depth + 1) / 2));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile, skillId, reducedMotion]);

  /* drag to spin */
  useEffect(() => {
    const wrap = orbitRef.current;
    if (!wrap || isMobile) return;
    let down = false;
    let lastX = 0;
    const pd = (e: PointerEvent) => { down = true; lastX = e.clientX; paused.current = true; };
    const pm = (e: PointerEvent) => { if (!down) return; rot.current += (e.clientX - lastX) * 0.25; lastX = e.clientX; };
    const pu = () => { down = false; paused.current = false; };
    wrap.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    return () => {
      wrap.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
    };
  }, [isMobile]);

  const hitCore = () => {
    const n = coreClicks + 1;
    setCoreClicks(n);
    sfx('power');
    if (n >= 5) { unlockDevMode(); setCoreClicks(0); }
    else if (n >= 1) toast(`CORE RESONANCE ${n}/5`, 'sys');
  };

  return (
    <section id="armory" className="relative overflow-hidden py-28 md:py-40" aria-label="The Power Armory — skills">
      <img src="/images/power-armory.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.22]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void" />
      <Embers count={12} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-10">
        <SectionHeading
          scene="SCENE 03 — THE TRAINING CHAMBER"
          kicker="SKILL MATRIX ONLINE"
          title="THE POWER"
          emberLine="ARMORY"
          right="Fifteen power cores orbit the center. Drag the ring, wake a core, enter its chamber. Hover to identify — click to activate."
        />

        {/* ======== DESKTOP ORBIT ======== */}
        {!isMobile && (
          <div
            ref={orbitRef}
            className="relative mx-auto h-[560px] max-w-5xl cursor-grab select-none active:cursor-grabbing lg:h-[620px]"
            role="group"
            aria-label="Orbiting technology power cores — drag to rotate"
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
          >
            {/* orbit rings */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[66%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-arc/10" aria-hidden />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-ember/10" aria-hidden style={{ animation: 'coreRing 26s linear infinite' }} />

            {/* AGNES CORE */}
            <button
              onClick={hitCore}
              className="group absolute left-1/2 top-1/2 z-[51] -translate-x-1/2 -translate-y-1/2 text-center"
              aria-label="The Agnes Core — central power source"
              data-cursor="core"
            >
              <span className="relative block h-32 w-32 lg:h-36 lg:w-36">
                <span className="absolute inset-0 rounded-full border border-ember/40" style={{ animation: 'pulseCore 2.2s ease-in-out infinite' }} />
                <span className="absolute inset-3 rounded-full bg-[radial-gradient(circle_at_50%_45%,#ffe9c9,#ff7a1a_42%,#3d1602_78%,transparent)]" style={{ animation: 'pulseCore 3s ease-in-out infinite', boxShadow: '0 0 80px rgba(255,122,26,.55)' }} />
                <span className="absolute inset-0 rounded-full border-t-2 border-arc/70" style={{ animation: 'spin 5s linear infinite' }} />
                <span className="absolute inset-[-14px] rounded-full border border-arc/15" style={{ animation: 'pulseCore 3.4s ease-in-out .5s infinite' }} />
              </span>
              <span className="mt-3 block font-mono text-[.55rem] tracking-[.4em] text-ember2">AGNES CORE</span>
              <span className="block font-mono text-[.42rem] tracking-[.3em] text-mist/40 transition-opacity group-hover:opacity-100 md:opacity-0">RESONANCE x5 = ?</span>
            </button>

            {/* cores */}
            {SKILLS.map((s) => (
              <button
                key={s.id}
                data-orb
                onClick={() => openSkill(s.id)}
                className="group absolute left-1/2 top-1/2 flex w-20 flex-col items-center"
                aria-label={`Activate ${s.name} — ${s.core}`}
                data-cursor="power"
              >
                <span className="relative grid h-16 w-16 place-items-center rounded-full border bg-void/70 backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                  style={{ borderColor: `${s.hue}55`, boxShadow: `0 0 22px -8px ${s.hue}66` }}>
                  <CoreVisual element={s.element} hue={s.hue} size={38} alive={!reducedMotion} />
                  <span className="absolute inset-0 rounded-full border-t border-transparent transition-all duration-500 group-hover:border-white/40 group-hover:[animation:spin_2s_linear_infinite]" />
                </span>
                <span className="mt-1.5 font-mono text-[.52rem] font-bold tracking-[.18em] text-white">{s.name}</span>
                <span className="font-mono text-[.42rem] tracking-[.16em] transition-colors" style={{ color: `${s.hue}99` }}>{s.core}</span>
              </button>
            ))}
          </div>
        )}

        {/* ======== MOBILE GRID ======== */}
        {isMobile && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {SKILLS.map((s) => (
              <button
                key={s.id}
                onClick={() => openSkill(s.id)}
                className="holo panel-clip flex flex-col items-center gap-2 p-4 active:scale-95"
                aria-label={`Activate ${s.name}`}
                data-cursor="power"
              >
                <CoreVisual element={s.element} hue={s.hue} size={34} alive={!reducedMotion} />
                <span className="font-mono text-[.5rem] font-bold tracking-[.14em] text-white">{s.name}</span>
                <span className="font-mono text-[.4rem] tracking-[.12em]" style={{ color: `${s.hue}aa` }}>{s.core}</span>
              </button>
            ))}
          </div>
        )}

        {/* category legend */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {(['BACKEND', 'FRONTEND', 'DATABASE', 'LANGUAGE', 'TOOLS', '3D & MOTION'] as const).map((c, i) => (
            <span key={c} className="chip !text-[.48rem]" style={{ borderColor: ['#ff7a1a55', '#41d9ff44', '#3fd0c944', '#69e2a044', '#4fb3ff44', '#8a6bff44'][i] }}>
              {c}
            </span>
          ))}
        </div>

        {/* ======== COMBINATION SYSTEM ======== */}
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-4">
            <StatusTag tone="ember">FUSION PROTOCOL</StatusTag>
            <span className="font-mono text-[.55rem] tracking-[.3em] text-mist/50">COMBINE CORES TO FORM HYBRID POWERS</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {SKILL_COMBOS.map((c) => (
              <div key={c.result} className="holo panel-clip group relative overflow-hidden p-5 transition-all duration-300 hover:border-ember/40">
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {c.skills.map((sid) => {
                    const sk = SKILLS.find((x) => x.id === sid);
                    if (!sk) return null;
                    return (
                      <button
                        key={sid}
                        onClick={() => openSkill(sid)}
                        className="chip !text-[.48rem] transition-all hover:scale-105"
                        style={{ borderColor: `${sk.hue}66`, color: sk.hue }}
                        data-cursor="power"
                        aria-label={`Open ${sk.name}`}
                      >
                        {sk.name}
                      </button>
                    );
                  })}
                </div>
                <div className="kicker kicker-ember mb-1">↓ FUSES INTO</div>
                <div className="font-display text-lg tracking-wider text-white text-glow-ember">{c.result}</div>
                <p className="mt-2 text-[.68rem] leading-relaxed text-mist/80">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
