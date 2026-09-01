import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { cn } from '../utils/cn';
import { useApp } from '../hooks/app';

type Variant = 'ember' | 'arc' | 'ghost' | 'gild';

const styles: Record<Variant, string> = {
  ember: 'border-ember/60 text-ember2 bg-ember/10 hover:bg-ember/20 hover:shadow-[0_0_40px_-8px_rgba(255,122,26,.7)]',
  arc: 'border-arc/50 text-arc bg-arc/5 hover:bg-arc/15 hover:shadow-[0_0_40px_-8px_rgba(65,217,255,.6)]',
  ghost: 'border-white/15 text-mist bg-white/[.03] hover:border-arc/50 hover:text-white',
  gild: 'border-gild/50 text-gild bg-gild/5 hover:bg-gild/15 hover:shadow-[0_0_40px_-8px_rgba(232,184,75,.6)]',
};

export default function MagneticButton({
  children, href, onClick, variant = 'ghost', icon, className, small, external, download, ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  small?: boolean;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const { isMobile, sfx } = useApp();

  const move = (e: MouseEvent) => {
    if (isMobile || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({ x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28 });
  };
  const leave = () => setT({ x: 0, y: 0 });

  const cls = cn(
    'group relative inline-flex items-center gap-3 border font-mono uppercase transition-all duration-300 active:scale-95 cursor-pointer select-none',
    small ? 'px-4 py-2 text-[.6rem] tracking-[.22em]' : 'px-7 py-3.5 text-[.68rem] tracking-[.3em]',
    'clip-path-none [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]',
    styles[variant],
    className,
  );

  const inner = (
    <>
      <span className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-0 left-[-60%] h-full w-[40%] bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] transition-all duration-700 group-hover:left-[130%]" />
      </span>
      {icon && <span className="relative transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">{icon}</span>}
      <span className="relative">{children}</span>
    </>
  );

  const style = { transform: `translate(${t.x}px, ${t.y}px)` };

  if (href) {
    return (
      <a
        ref={(el) => { ref.current = el; }}
        href={href}
        onMouseMove={move}
        onMouseLeave={leave}
        onClick={() => sfx('click')}
        style={style}
        className={cls}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={download}
        data-cursor="link"
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={(el) => { ref.current = el; }}
      onClick={() => { sfx('click'); onClick?.(); }}
      onMouseMove={move}
      onMouseLeave={leave}
      style={style}
      className={cls}
      aria-label={ariaLabel}
      data-cursor="link"
    >
      {inner}
    </button>
  );
}
