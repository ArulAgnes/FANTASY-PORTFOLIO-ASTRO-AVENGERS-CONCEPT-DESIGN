import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Mail, BadgeCheck } from 'lucide-react';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers } from './ui';
import { Sigil } from './Navbar';
import { ORIGIN_PANELS, SITE } from '../data/resume';

gsap.registerPlugin(ScrollTrigger);

export default function Origin() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useApp();

  useEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((p, i) => {
        gsap.fromTo(p,
          { clipPath: i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', opacity: .4 },
          {
            clipPath: 'inset(0 0% 0 0%)', opacity: 1, duration: 1.1, ease: 'power3.inOut',
            scrollTrigger: { trigger: p, start: 'top 84%' },
          });
        gsap.fromTo(p.querySelectorAll('[data-panel-in]'),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, stagger: .09, duration: .7, delay: .35, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 84%' } });
      });
      gsap.fromTo('[data-idcard]',
        { rotateY: 55, opacity: 0, transformPerspective: 900 },
        { rotateY: 0, opacity: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="origin" ref={root} className="relative overflow-hidden px-4 py-28 md:px-10 md:py-40" aria-label="The Origin — about">
      <Embers count={10} />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          scene="SCENE 02 — ORIGIN FILE 001"
          kicker="SUBJECT: ARUL · STATUS: ACTIVE"
          title="THE ORIGIN"
          emberLine="OF A DEVELOPER"
          right="Every panel below is a fact from the mission record. No invented stats — only the story of a developer forged in code."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* comic panels */}
          <div className="space-y-8">
            {ORIGIN_PANELS.map((p, i) => (
              <article
                key={p.k}
                data-panel
                className={`panel-clip panel-edge holo relative overflow-hidden p-7 md:p-9 ${i % 2 ? 'md:ml-14' : 'md:mr-14'}`}
              >
                <div data-panel-in className="kicker kicker-ember mb-3">{p.k}</div>
                <h3 data-panel-in className="font-display text-2xl tracking-wide text-white md:text-4xl">{p.title}</h3>
                <p data-panel-in className="mt-3 max-w-xl text-sm leading-relaxed text-mist">{p.body}</p>
                <span className="pointer-events-none absolute -right-4 -top-6 font-display text-[7rem] leading-none text-white/[.03] md:text-[10rem]" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </article>
            ))}
          </div>

          {/* identity card */}
          <aside data-idcard className="h-fit lg:sticky lg:top-28" aria-label="Identity card">
            <div className="holo panel-clip relative overflow-hidden p-7" style={{ transformStyle: 'preserve-3d' }}>
              <div className="mb-5 flex items-center justify-between">
                <StatusTag tone="ember">IDENTITY VERIFIED</StatusTag>
                <Sigil size={40} />
              </div>
              <h3 className="font-cinzel text-lg font-bold tracking-[.14em] text-white">{SITE.name}</h3>
              <p className="mt-1 font-mono text-[.6rem] tracking-[.3em] text-ember">{SITE.role}</p>
              <div className="my-5 h-px bg-gradient-to-r from-white/20 to-transparent" />
              <ul className="space-y-3 font-mono text-[.62rem] tracking-[.14em] text-mist">
                <li className="flex items-start gap-2.5"><MapPin size={13} className="mt-0.5 shrink-0 text-arc" /> {SITE.location}</li>
                <li className="flex items-start gap-2.5"><Mail size={13} className="mt-0.5 shrink-0 text-arc" /> {SITE.email}</li>
                <li className="flex items-start gap-2.5"><BadgeCheck size={13} className="mt-0.5 shrink-0 text-arc" /> OPEN TO NEW MISSIONS</li>
              </ul>
              <div className="my-5 h-px bg-gradient-to-r from-white/20 to-transparent" />
              <div className="flex flex-wrap gap-1.5">
                {['PHP', 'LARAVEL', 'MYSQL', 'JS', 'HTML', 'CSS', 'BOOTSTRAP'].map((t) => (
                  <span key={t} className="chip !text-[.5rem] !px-2 !py-1">{t}</span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-[-10%] h-8 bg-gradient-to-b from-arc/15 to-transparent" style={{ animation: 'scanY 4.5s ease-in-out infinite' }} aria-hidden />
            </div>
            <p className="mt-3 text-center font-mono text-[.52rem] tracking-[.34em] text-mist/40">SOURCE OF TRUTH — RESUME</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
