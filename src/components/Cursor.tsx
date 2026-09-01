import { useEffect, useRef, useState } from 'react';

type CursorKind = 'default' | 'link' | 'power' | 'portal' | 'project' | 'core';

const LABELS: Record<CursorKind, string> = {
  default: '', link: 'OPEN', power: 'ACTIVATE', portal: 'ENTER', project: 'EXPLORE', core: 'PULSE',
};
const HUES: Record<CursorKind, string> = {
  default: '#9db2ce', link: '#41d9ff', power: '#ff7a1a', portal: '#8a6bff', project: '#ffb25e', core: '#ffe259',
};

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<CursorKind>('default');
  const [visible, setVisible] = useState(false);
  const [coarse, setCoarse] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setCoarse(!mq.matches);
    const onChange = () => setCoarse(!mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (coarse) return;
    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      setVisible(true);
      const t = e.target as HTMLElement;
      const hit = t.closest?.('[data-cursor]') as HTMLElement | null;
      setKind((hit?.dataset.cursor as CursorKind) || (t.closest?.('a,button,input,select,[role="button"]') ? 'link' : 'default'));
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [coarse]);

  if (coarse) return null;
  const hue = HUES[kind];
  const scale = kind === 'default' ? 1 : kind === 'link' ? 1.7 : 2.2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}>
      {/* dot */}
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px]">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: hue, boxShadow: `0 0 12px ${hue}` }} />
      </div>
      {/* ring */}
      <div ref={ring} className="absolute left-0 top-0 -ml-[22px] -mt-[22px]">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300"
          style={{
            borderColor: hue,
            transform: `scale(${scale})`,
            boxShadow: kind !== 'default' ? `0 0 26px -6px ${hue}, inset 0 0 14px -6px ${hue}` : 'none',
            background: kind === 'power' || kind === 'portal' ? `${hue}14` : 'transparent',
          }}
        >
          {LABELS[kind] && (
            <span className="font-mono text-[.34rem] font-bold tracking-[.18em]" style={{ color: hue }}>
              {LABELS[kind]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
