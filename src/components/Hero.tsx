import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Zap, Globe } from 'lucide-react';
import { createHeroScene } from '../three/heroScene';
import type { HeroHandle } from '../three/heroScene';
import { useApp } from '../hooks/app';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const sceneHandle = useRef<HeroHandle | null>(null);
  const [glOk, setGlOk] = useState(true);
  const { booted, reducedMotion, isMobile, scrollTo, sfx } = useApp();

  /* three.js city */
  useEffect(() => {
    if (!canvasRef.current) return;
    const handle = createHeroScene(canvasRef.current, { reducedMotion, quality: isMobile ? 0.55 : 1 });
    sceneHandle.current = handle;
    setGlOk(handle.ok);
    const onMove = (e: MouseEvent) => {
      handle.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); handle.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* scroll-driven camera + content parallax */
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => sceneHandle.current?.setProgress(self.progress),
      });
      gsap.to('[data-hero-fade]', {
        yPercent: -30, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '60% top', scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* cinematic letter intro after boot */
  useEffect(() => {
    if (!booted || !rootRef.current) return;
    if (reducedMotion) { gsap.set('[data-hero-anim]', { opacity: 1 }); return; }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('[data-hero-bar-top]', { yPercent: -100 }, { yPercent: 0, duration: .8 }, 0)
        .fromTo('[data-hero-bar-bot]', { yPercent: 100 }, { yPercent: 0, duration: .8 }, 0)
        .fromTo('[data-hero-tag]', { opacity: 0, letterSpacing: '1.4em' }, { opacity: 1, letterSpacing: '.42em', duration: 1.2 }, .3)
        .fromTo('[data-letter]', { rotateX: 95, y: 160, opacity: 0, filter: 'blur(6px)' },
          { rotateX: 0, y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, stagger: .13, ease: 'back.out(1.4)' }, .5)
        .fromTo('[data-letter2]', { rotateX: -60, y: 60, opacity: 0 }, { rotateX: 0, y: 0, opacity: 1, duration: .9, stagger: .05 }, 1.15)
        .fromTo('[data-hero-sub]', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .8 }, 1.7)
        .fromTo('[data-hero-roles] > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: .12, duration: .6 }, 1.85)
        .fromTo('[data-hero-tag2]', { opacity: 0 }, { opacity: 1, duration: .8 }, 2.1)
        .fromTo('[data-hero-cta] > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: .12, duration: .7 }, 2.2)
        .fromTo('[data-hero-scroll]', { opacity: 0 }, { opacity: 1, duration: .8 }, 2.6);
      // subtle lightning to celebrate
      tl.call(() => sceneHandle.current?.strike(), [], 1.4);
    }, rootRef);
    return () => ctx.revert();
  }, [booted, reducedMotion]);

  return (
    <section id="hero" ref={rootRef} className="relative h-screen min-h-[620px] overflow-hidden md:h-[106vh]" aria-label="The Agnesverse — hero">
      {/* cinematic fallback image (also sits behind WebGL) */}
      <img
        src="/images/agnesverse-city.jpg"
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${glOk ? 'opacity-0' : 'opacity-60'}`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      {/* atmosphere overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/70 via-transparent to-void" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void to-transparent" />

      {/* letterbox bars */}
      <div data-hero-bar-top data-hero-anim className="absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between bg-black/80 px-5 font-mono text-[.5rem] tracking-[.4em] text-mist/50">
        <span>SCENE 01 — THE CITY</span>
        <span className="hidden sm:inline">CAMERA A — WIDE / SLOW PUSH-IN</span>
        <span className="text-ember/70">REC ●</span>
      </div>
      <div data-hero-bar-bot data-hero-anim className="absolute inset-x-0 bottom-0 z-20 flex h-9 items-center justify-between bg-black/80 px-5 font-mono text-[.5rem] tracking-[.4em] text-mist/50">
        <span>AGNESVERSE ENTRY GATE</span>
        <span>FOCAL — PORTAL 01</span>
      </div>

      {/* typography */}
      <div data-hero-fade className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <p data-hero-tag data-hero-anim className="kicker kicker-ember mb-5 md:mb-7">ENTERING — THE AGNESVERSE</p>

        <h1 className="relative" style={{ perspective: '900px' }}>
          <span className="block font-display leading-[.85] tracking-wide text-white" style={{ fontSize: 'clamp(4.6rem, 19vw, 15rem)' }}>
            {'ARUL'.split('').map((c, i) => (
              <span key={i} data-letter data-hero-anim className="inline-block text-glow-ember will-change-transform" style={{ textShadow: '0 10px 60px rgba(255,122,26,.35)' }}>
                {c}
              </span>
            ))}
          </span>
          <span className="mt-1 block font-display tracking-[.28em] text-transparent md:mt-2" style={{ fontSize: 'clamp(1.4rem, 5vw, 3.6rem)', WebkitTextStroke: '1.5px rgba(190,215,255,.75)' }}>
            {'MARIA AGNES I'.split('').map((c, i) => (
              <span key={i} data-letter2 data-hero-anim className="inline-block will-change-transform">{c === ' ' ? '\u00A0' : c}</span>
            ))}
          </span>
        </h1>

        <div data-hero-sub data-hero-anim className="mt-6 h-px w-48 bg-gradient-to-r from-transparent via-ember to-transparent md:mt-8 md:w-72" />

        <div data-hero-roles className="mt-5 flex flex-wrap items-center justify-center gap-2 md:mt-6 md:gap-3">
          {['PHP WEB DEVELOPER', 'FULL-STACK DEVELOPER', 'CREATIVE TECHNOLOGIST'].map((r) => (
            <span key={r} data-hero-anim className="chip text-arc border-arc/30">{r}</span>
          ))}
        </div>

        <p data-hero-tag2 data-hero-anim className="mt-5 max-w-md font-mono text-[.66rem] leading-relaxed tracking-[.2em] text-mist/75 md:mt-6">
          BUILDING DYNAMIC WEB EXPERIENCES WITH CODE, CREATIVITY AND TECHNOLOGY.
        </p>

        <div data-hero-cta className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10">
          <MagneticButton variant="ember" icon={<Zap size={13} />} onClick={() => { scrollTo('#origin'); }}>
            Enter Agnesverse
          </MagneticButton>
          <MagneticButton variant="ghost" icon={<Globe size={13} />} onClick={() => scrollTo('#battleground')}>
            Project Battleground
          </MagneticButton>
        </div>
      </div>

      {/* scroll cue */}
      <button
        data-hero-scroll
        data-hero-anim
        onClick={() => { scrollTo('#origin'); sfx('portal'); }}
        className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-center"
        aria-label="Scroll down to enter"
        data-cursor="portal"
      >
        <span className="mx-auto block h-12 w-px bg-gradient-to-b from-transparent via-arc to-transparent" />
        <ChevronDown size={14} className="mx-auto mt-2 animate-bounce text-arc" />
        <span className="mt-2 block font-mono text-[.5rem] tracking-[.4em] text-mist/50">SCROLL</span>
      </button>
    </section>
  );
}
