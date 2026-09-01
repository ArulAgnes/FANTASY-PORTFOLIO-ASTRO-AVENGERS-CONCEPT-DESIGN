import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, FileDown, Mail } from 'lucide-react';
import { useApp } from '../hooks/app';
import { GithubIcon, Embers } from './ui';
import MagneticButton from './MagneticButton';
import { FIVE_CORES, SITE } from '../data/resume';

gsap.registerPlugin(ScrollTrigger);

export default function Finale() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion, scrollTo, toast } = useApp();
  const [stage, setStage] = useState(0);
  const fired = useRef(false);

  /* cinematic staged reveal on approach */
  useEffect(() => {
    if (!root.current || fired.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || fired.current) return;
      fired.current = true;
      toast('ALL SYSTEMS SYNCHRONIZED', 'power');
      const speed = reducedMotion ? 60 : 700;
      for (let i = 1; i <= 4; i++) window.setTimeout(() => setStage(i), i * speed);
    }, { threshold: 0.35 });
    io.observe(root.current);

    if (!reducedMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo('[data-finale-title]',
          { scale: .8, opacity: 0, filter: 'blur(10px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power3.out', duration: 1.4, scrollTrigger: { trigger: root.current, start: 'top 60%' } });
        gsap.to('[data-core-wrap]', { scale: 0.86, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true } });
      }, root);
      return () => { ctx.revert(); io.disconnect(); };
    }
    return () => io.disconnect();
  }, [reducedMotion, toast]);

  return (
    <section id="finale" ref={root} className="relative overflow-hidden px-4 py-32 md:py-52" aria-label="Final cinematic — the Agnes Core">
      <img src="/images/agnes-core.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.3]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#04060c_78%)]" />
      <Embers count={16} />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-10 flex justify-center"><span className="tag-scene">FINAL SCENE — EVERYTHING CONNECTED</span></div>

        {/* the five artifacts converging */}
        <div data-core-wrap className="relative mx-auto mb-12 h-64 w-64 md:h-80 md:w-80" style={{ perspective: '900px' }}>
          {FIVE_CORES.map((c, i) => {
            const a = (i / FIVE_CORES.length) * Math.PI * 2 - Math.PI / 2;
            const r = stage >= 2 ? 0 : 38; // converge
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            const lit = stage >= 1;
            return (
              <div
                key={c.name}
                className="absolute left-1/2 top-1/2 transition-all duration-[1200ms] ease-[cubic-bezier(.5,0,.2,1)]"
                style={{ transform: `translate(-50%,-50%) translate(${x}%, ${y}%) scale(${stage >= 2 ? 0.3 : 1})`, opacity: lit ? (stage >= 2 ? 0 : 1) : 0.15 }}
                aria-hidden
              >
                <div className="h-14 w-14 rounded-full border md:h-16 md:w-16" style={{ borderColor: c.hue, background: `radial-gradient(circle, ${c.hue}55, transparent 70%)`, boxShadow: lit ? `0 0 40px -4px ${c.hue}` : 'none' }} />
                <div className="mt-1 whitespace-nowrap font-mono text-[.4rem] tracking-[.2em]" style={{ color: c.hue }}>{c.name}</div>
              </div>
            );
          })}
          {/* unified core */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[1400ms]"
            style={{ transform: `translate(-50%,-50%) scale(${stage >= 2 ? 1 : 0.2})`, opacity: stage >= 2 ? 1 : 0 }}
            aria-hidden
          >
            <div className="relative h-40 w-40 md:h-52 md:w-52">
              <div className="absolute inset-0 rounded-full border border-white/30" style={{ animation: 'pulseCore 2.4s ease-in-out infinite' }} />
              <div className="absolute inset-4 rounded-full" style={{ background: 'radial-gradient(circle at 50% 45%, #fff, #ffd9a0 22%, #ff7a1a 45%, #41d9ff 72%, transparent 78%)', boxShadow: '0 0 140px -10px rgba(255,170,80,.8)', animation: 'pulseCore 3.6s ease-in-out infinite' }} />
              <div className="absolute inset-0 rounded-full border-t-2 border-white/70" style={{ animation: 'spin 6s linear infinite' }} />
            </div>
            <div className="mt-2 text-center font-mono text-[.55rem] tracking-[.5em] text-white/90">AGNES CORE</div>
          </div>
        </div>

        <div style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 1s' }}>
          <div className="mb-4 flex flex-wrap justify-center gap-2 md:gap-3">
            {['CODE', 'CREATE', 'SOLVE', 'DEPLOY'].map((w) => (
              <span key={w} className="chip border-ember/40 text-ember2">{w}</span>
            ))}
          </div>
          <h2 data-finale-title className="font-display text-[clamp(2.2rem,6.5vw,5.4rem)] leading-[.95] tracking-wide text-white">
            {SITE.name}
          </h2>
          <p className="mt-2 font-mono text-[.62rem] tracking-[.4em] text-arc">{SITE.role}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4" style={{ opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? 'none' : 'translateY(24px)', transition: 'all 1s' }}>
          <MagneticButton variant="ember" icon={<Rocket size={13} />} onClick={() => scrollTo('#battleground')}>View Projects</MagneticButton>
          <MagneticButton variant="ghost" icon={<GithubIcon size={13} />} href={SITE.github} external>GitHub</MagneticButton>
          <MagneticButton variant="gild" icon={<FileDown size={13} />} onClick={() => scrollTo('#contact')}>Resume File</MagneticButton>
          <MagneticButton variant="arc" icon={<Mail size={13} />} onClick={() => scrollTo('#contact')}>Contact</MagneticButton>
        </div>

        <p className="mt-16 font-cinzel text-sm font-bold tracking-[.42em] text-mist/60 md:text-base" style={{ opacity: stage >= 4 ? 1 : 0, transition: 'opacity 1.4s .3s' }}>
          SEE YOU IN THE NEXT BUILD.
        </p>
      </div>
    </section>
  );
}
