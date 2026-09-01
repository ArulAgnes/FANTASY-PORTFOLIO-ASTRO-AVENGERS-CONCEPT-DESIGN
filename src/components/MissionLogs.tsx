import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, CalendarDays, Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers } from './ui';
import { EXPERIENCE } from '../data/resume';

gsap.registerPlugin(ScrollTrigger);

export default function MissionLogs() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion, toast } = useApp();

  useEffect(() => {
    if (!root.current) return;
    const el = root.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { toast('MISSION LOG DECRYPTED', 'sys'); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);

    if (reducedMotion) return () => io.disconnect();
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-brief]',
        { clipPath: 'inset(12% 8% 12% 8%)', opacity: 0, scale: .96 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%' } });
      gsap.fromTo('[data-obj]',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: .12, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '[data-objlist]', start: 'top 85%' } });
    }, el);
    return () => { ctx.revert(); io.disconnect(); };
  }, [reducedMotion, toast]);

  return (
    <section id="missions" ref={root} className="relative overflow-hidden px-4 py-28 md:px-10 md:py-40" aria-label="Mission logs — experience">
      <Embers count={8} hue="#41d9ff" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          scene="SCENE 04 — MISSION CONTROL"
          kicker="DECRYPTED FIELD RECORD"
          title="MISSION"
          emberLine="LOGS"
          right="One completed field mission, straight from the record: the DevSkillHub frontend operation, June to July 2024."
        />

        <div data-brief className="holo panel-clip relative overflow-hidden">
          {/* radar deco */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-arc/15" aria-hidden>
            <div className="absolute inset-6 rounded-full border border-arc/10" />
            <div className="absolute inset-14 rounded-full border border-arc/10" />
            <div className="absolute inset-0" style={{ background: 'conic-gradient(from 0deg, rgba(65,217,255,.14), transparent 70deg)', animation: 'spin 6s linear infinite', borderRadius: '999px' }} />
          </div>

          <div className="border-b border-white/10 bg-white/[.02] px-6 py-4 md:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Crosshair size={15} className="text-ember" />
                <span className="font-mono text-[.62rem] tracking-[.34em] text-ember2">MISSION 01 — {EXPERIENCE.title}</span>
              </div>
              <StatusTag tone="arc">STATUS: COMPLETE</StatusTag>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-[1fr_320px]">
            <div className="p-6 md:p-10">
              <div className="mb-6 flex flex-wrap gap-6 font-mono text-[.62rem] tracking-[.2em]">
                <span className="flex items-center gap-2 text-mist"><Building2 size={13} className="text-arc" /> {EXPERIENCE.company.toUpperCase()}</span>
                <span className="flex items-center gap-2 text-mist"><CalendarDays size={13} className="text-arc" /> {EXPERIENCE.period.toUpperCase()}</span>
              </div>
              <h3 className="font-display text-3xl tracking-wide text-white md:text-5xl">{EXPERIENCE.role.toUpperCase()}</h3>
              <p className="mt-2 font-mono text-[.6rem] tracking-[.3em] text-ember">FRONTEND WEB DEVELOPMENT INTERN</p>

              <div className="mt-8" data-objlist>
                <div className="kicker mb-4">MISSION OBJECTIVES — ALL CLEARED</div>
                <ul className="space-y-3">
                  {EXPERIENCE.objectives.map((o) => (
                    <li key={o} data-obj className="flex items-start gap-3 border border-white/10 bg-white/[.02] px-4 py-3 text-sm text-mist/90 transition-colors hover:border-arc/40">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-arc" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/30 p-6 md:border-l md:border-t-0 md:p-8">
              <div className="kicker kicker-ember mb-4">FIELD EQUIPMENT</div>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE.tools.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <div className="kicker kicker-ember mb-4 mt-8">MISSION VITALS</div>
              <dl className="space-y-3 font-mono text-[.62rem] tracking-[.16em] text-mist">
                <div className="flex justify-between border-b border-white/5 pb-2"><dt>ROLE</dt><dd className="text-white">INTERN</dd></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><dt>DOMAIN</dt><dd className="text-white">FRONTEND</dd></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><dt>DURATION</dt><dd className="text-white">2 MONTHS</dd></div>
                <div className="flex justify-between"><dt>OUTCOME</dt><dd className="text-arc">OBJECTIVES CLEARED</dd></div>
              </dl>
              <div className="mt-8 border border-arc/20 bg-arc/5 px-4 py-3 font-mono text-[.56rem] leading-relaxed tracking-[.14em] text-arc/90">
                CROSS-BROWSER · PIXEL-ACCURATE · PERFORMANCE-TUNED · TEAM-COORDINATED
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
