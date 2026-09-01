import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../hooks/app';

gsap.registerPlugin(ScrollTrigger);

/* Cinematic section heading: scene tag + kicker + giant display title */
export function SectionHeading({
  scene, kicker, title, emberLine, right,
}: {
  scene: string;
  kicker: string;
  title: string;
  emberLine?: string;
  right?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useApp();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('[data-line]'),
        { yPercent: 110, rotateX: -35, opacity: 0 },
        {
          yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        });
    }, el);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={ref} className="relative mb-14 md:mb-20" style={{ perspective: '800px' }}>
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div data-line className="tag-scene mb-4">{scene}</div>
          <div data-line className="kicker mb-3">{kicker}</div>
          <h2
            data-line
            className="font-display text-[clamp(2.6rem,8.5vw,7rem)] leading-[.92] tracking-wide text-white uppercase"
          >
            {title}
            {emberLine && <span className="block text-ember text-glow-ember">{emberLine}</span>}
          </h2>
        </div>
        {right && (
          <p data-line className="max-w-xs text-[.72rem] leading-relaxed text-mist/80 font-mono tracking-wider pb-3">
            {right}
          </p>
        )}
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-ember/60 via-white/10 to-transparent" />
    </div>
  );
}

/* Original GitHub mark (lucide-react dropped brand icons) */
export function GithubIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18 1.02.31 2.11.47 3.2.47s2.18-.16 3.2-.47c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/* A comic-book status caption chip */
export function StatusTag({ children, tone = 'arc' }: { children: import('react').ReactNode; tone?: 'arc' | 'ember' | 'gild' | 'dim' }) {
  const map = {
    arc: 'text-arc border-arc/40 bg-arc/5',
    ember: 'text-ember2 border-ember/40 bg-ember/5',
    gild: 'text-gild border-gild/40 bg-gild/5',
    dim: 'text-mist/60 border-white/10 bg-white/[.02]',
  } as const;
  return (
    <span className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[.58rem] tracking-[.3em] uppercase ${map[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'dim' ? 'bg-mist/40' : 'bg-current'} animate-pulse`} />
      {children}
    </span>
  );
}

/* Ambient ember particle field (pure CSS, cheap) */
export function Embers({ count = 14, hue = '#ff7a1a' }: { count?: number; hue?: string }) {
  const { reducedMotion, isMobile } = useApp();
  if (reducedMotion) return null;
  const n = isMobile ? Math.min(6, count) : count;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: n }).map((_, i) => {
        const left = (i * 61.8) % 100;
        const size = 2 + ((i * 7) % 4);
        const dur = 6 + ((i * 13) % 8);
        const delay = -((i * 1.7) % dur);
        const dx = ((i * 37) % 60) - 30;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: '-4px',
              width: size,
              height: size,
              background: hue,
              boxShadow: `0 0 ${size * 3}px ${hue}`,
              opacity: 0,
              ['--dx' as string]: `${dx}px`,
              animation: `emberDrift ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

/* cinematic scroll-progress HUD strip */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[95] h-[2px] bg-white/5" aria-hidden>
      <div ref={bar} className="h-full origin-left bg-gradient-to-r from-ember via-arc to-vio" style={{ transform: 'scaleX(0)', boxShadow: '0 0 12px rgba(255,122,26,.7)' }} />
    </div>
  );
}

/* vertical side label seen in cinematic frames */
export function SideLabel({ children, side = 'left' }: { children: string; side?: 'left' | 'right' }) {
  return (
    <div
      className={`pointer-events-none fixed top-1/2 z-40 hidden -translate-y-1/2 lg:block ${side === 'left' ? 'left-5' : 'right-5'}`}
      style={{ writingMode: 'vertical-rl' }}
      aria-hidden
    >
      <span className="font-mono text-[.55rem] tracking-[.5em] uppercase text-mist/30">{children}</span>
    </div>
  );
}
