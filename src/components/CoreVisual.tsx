import type { SkillElement } from '../data/resume';

/* Elemental mini-visual per power core — original SVG/CSS artifacts. */
export default function CoreVisual({ element, hue, size = 46, alive = true }: {
  element: SkillElement | 'geometric';
  hue: string;
  size?: number;
  alive?: boolean;
}) {
  const s = { width: size, height: size };
  const anim = alive ? '' : '[animation-play-state:paused]';
  const glow = { filter: `drop-shadow(0 0 ${size / 5}px ${hue}88)` };

  switch (element) {
    case 'fire':
      return (
        <div className={`relative ${anim}`} style={{ ...s, ...glow }} aria-hidden>
          <div className="absolute inset-[18%] rounded-full" style={{ background: `radial-gradient(circle at 50% 65%, #ffe9c9, ${hue} 45%, #7a1e00 80%, transparent)`, animation: 'pulseCore 1.4s ease-in-out infinite' }} />
          <div className="absolute left-1/2 top-[6%] h-[38%] w-[26%] -translate-x-1/2 rounded-b-full" style={{ background: `linear-gradient(to top, ${hue}, transparent)`, borderRadius: '50% 50% 20% 20%', animation: 'flicker 2.2s linear infinite', transform: 'translateX(-50%) scaleY(-1)' }} />
        </div>
      );
    case 'forge':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <path d="M14 30 h20 l-3 10 h-14 z" fill="none" stroke={hue} strokeWidth="1.6" />
          <path d="M19 30 v-6 h10 v6" fill="none" stroke={hue} strokeWidth="1.4" opacity=".7" />
          <circle cx="24" cy="15" r="4.5" fill={hue} style={{ animation: 'pulseCore 1.6s ease-in-out infinite', transformOrigin: '24px 15px' }} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line key={a} x1="24" y1="6" x2="24" y2="2" stroke={hue} strokeWidth="1.4" opacity=".7" transform={`rotate(${a} 24 15)`} />
          ))}
        </svg>
      );
    case 'crystal':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <g style={{ animation: 'portalSpin 9s linear infinite', transformOrigin: '24px 24px' }}>
            <polygon points="24,4 38,14 38,32 24,44 10,32 10,14" fill={`${hue}18`} stroke={hue} strokeWidth="1.5" />
            <polygon points="24,10 33,17 33,30 24,38 15,30 15,17" fill="none" stroke={hue} strokeWidth="1" opacity=".6" />
            <line x1="24" y1="4" x2="24" y2="44" stroke={hue} strokeWidth=".8" opacity=".5" />
            <line x1="10" y1="14" x2="38" y2="32" stroke={hue} strokeWidth=".8" opacity=".5" />
            <line x1="38" y1="14" x2="10" y2="32" stroke={hue} strokeWidth=".8" opacity=".5" />
          </g>
          <circle cx="24" cy="24" r="3" fill={hue} />
        </svg>
      );
    case 'ocean':
      return (
        <div className="relative overflow-hidden rounded-full border" style={{ ...s, borderColor: `${hue}66`, ...glow }} aria-hidden>
          <div className={`absolute inset-x-[-40%] bottom-0 top-[30%] ${anim}`} style={{ background: `linear-gradient(${hue}cc, ${hue}22)`, borderRadius: '42%', animation: 'portalSpin 6s linear infinite' }} />
          <div className={`absolute inset-x-[-40%] bottom-0 top-[36%] ${anim}`} style={{ background: `${hue}55`, borderRadius: '46%', animation: 'portalSpin 9s linear infinite reverse' }} />
        </div>
      );
    case 'electric':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <path d="M27 4 L14 26 h8 L19 44 L36 20 h-9 z" fill={hue} style={{ animation: 'zapping 3.4s steps(1) infinite' }} />
          <path d="M27 4 L14 26 h8 L19 44 L36 20 h-9 z" fill="none" stroke={hue} strokeWidth="1.2" opacity=".7" />
          <circle cx="10" cy="12" r="1.4" fill={hue} opacity=".8" />
          <circle cx="39" cy="34" r="1.4" fill={hue} opacity=".8" />
        </svg>
      );
    case 'arch':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <rect x="8" y="34" width="32" height="8" fill="none" stroke={hue} strokeWidth="1.4" />
          <rect x="12" y="22" width="10" height="12" fill={`${hue}22`} stroke={hue} strokeWidth="1.2" />
          <rect x="26" y="14" width="10" height="20" fill="none" stroke={hue} strokeWidth="1.2" />
          <rect x="14" y="24.5" width="2.4" height="2.4" fill={hue} style={{ animation: 'blinkHard 2.4s steps(1) infinite' }} />
          <rect x="28.5" y="17" width="2.4" height="2.4" fill={hue} style={{ animation: 'blinkHard 3.1s steps(1) infinite' }} />
          <line x1="26" y1="14" x2="31" y2="6" stroke={hue} strokeWidth="1.2" />
        </svg>
      );
    case 'shape':
      return (
        <div style={{ ...s, ...glow }} className={`flex items-center justify-center ${anim}`} aria-hidden>
          <div style={{ width: size * 0.58, height: size * 0.58, border: `2px solid ${hue}`, background: `${hue}14`, animation: 'shapeMorph 5s ease-in-out infinite' }} />
          <style>{`@keyframes shapeMorph { 0%,100% { border-radius: 6%; transform: rotate(0deg);} 50% { border-radius: 50%; transform: rotate(135deg);} }`}</style>
        </div>
      );
    case 'construct':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
            <rect key={`${r}${c}`} x={8 + c * 11} y={30 - r * 11} width="9" height="9" fill={r === 2 && c === 2 ? hue : 'none'} stroke={hue} strokeWidth="1.2"
              style={{ animation: `blinkHard ${2 + r * 0.7 + c * 0.4}s steps(1) infinite`, opacity: r === 2 && c === 2 ? 1 : undefined }} />
          )))}
          <line x1="6" y1="42" x2="42" y2="42" stroke={hue} strokeWidth="1.4" />
        </svg>
      );
    case 'machine':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <g style={{ animation: 'portalSpin 7s linear infinite', transformOrigin: '17px 20px' }}>
            <Gear cx={17} cy={20} r={9} hue={hue} />
          </g>
          <g style={{ animation: 'portalSpin 7s linear infinite reverse', transformOrigin: '32px 30px' }}>
            <Gear cx={32} cy={30} r={7} hue={hue} />
          </g>
        </svg>
      );
    case 'intellect':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <path d="M17 10 q-6 14 0 28 M31 10 q6 14 0 28" fill="none" stroke={hue} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3.4" fill={hue} style={{ animation: 'pulseCore 1.8s ease-in-out infinite', transformOrigin: '24px 24px' }} />
          {[8, 40].map((x) => <circle key={x} cx={x} cy={24} r="1.3" fill={hue} opacity=".7" />)}
        </svg>
      );
    case 'timeline':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <circle cx="24" cy="24" r="17" fill="none" stroke={hue} strokeWidth="1.2" opacity=".5" strokeDasharray="3 4" />
          <line x1="8" y1="24" x2="40" y2="24" stroke={hue} strokeWidth="1.4" />
          {[12, 20, 28, 36].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="24" r="2.2" fill="#04060c" stroke={hue} strokeWidth="1.3" />
              {i % 2 === 0 && <line x1={x} y1="24" x2={x} y2="14" stroke={hue} strokeWidth=".9" opacity=".6" />}
            </g>
          ))}
          <circle cx="36" cy="24" r="2.2" fill={hue} style={{ animation: 'pulseCore 2s ease-in-out infinite', transformOrigin: '36px 24px' }} />
        </svg>
      );
    case 'container':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <rect x="10" y="26" width="12" height="12" fill="none" stroke={hue} strokeWidth="1.3" />
          <rect x="26" y="26" width="12" height="12" fill={`${hue}22`} stroke={hue} strokeWidth="1.3" />
          <rect x="18" y="12" width="12" height="12" fill="none" stroke={hue} strokeWidth="1.3" />
          {[0, 1, 2].map((i) => <line key={i} x1={13 + i * 12.6} y1="29" x2={13 + i * 12.6} y2="35" stroke={hue} strokeWidth=".8" opacity=".6" />)}
          <line x1="24" y1="24" x2="24" y2="26" stroke={hue} strokeWidth="1.2" />
        </svg>
      );
    case 'dimension':
      return (
        <div style={{ ...s, perspective: 300, ...glow }} className="flex items-center justify-center" aria-hidden>
          <div className={anim} style={{ width: size * 0.5, height: size * 0.5, transformStyle: 'preserve-3d', animation: 'cubeSpin 7s linear infinite', position: 'relative' }}>
            {[
              'rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(270deg)', 'rotateX(90deg)', 'rotateX(-90deg)',
            ].map((tr, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, border: `1.4px solid ${hue}`, background: `${hue}0d`, transform: `${tr} translateZ(${size * 0.25}px)` }} />
            ))}
          </div>
          <style>{`@keyframes cubeSpin { from { transform: rotateX(-20deg) rotateY(0);} to { transform: rotateX(-20deg) rotateY(360deg);} }`}</style>
        </div>
      );
    case 'temporal':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <circle cx="24" cy="24" r="17" fill="none" stroke={hue} strokeWidth="1.3" />
          <g style={{ animation: 'portalSpin 5s cubic-bezier(.6,0,.4,1) infinite', transformOrigin: '24px 24px' }}>
            <line x1="24" y1="24" x2="24" y2="11" stroke={hue} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="24" y1="24" x2="31" y2="27" stroke={hue} strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
          </g>
          <circle cx="24" cy="24" r="2.4" fill={hue} />
        </svg>
      );
    case 'flow':
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          {[16, 24, 32].map((y, i) => (
            <path key={y} d={`M6 ${y} q6 ${i % 2 ? 6 : -6} 12 0 t12 0 t12 0`} fill="none" stroke={hue} strokeWidth="1.4" opacity={1 - i * 0.25}
              strokeDasharray="6 5" style={{ animation: `dashFlow ${3 + i}s linear infinite` }} />
          ))}
        </svg>
      );
    case 'geometric':
    default:
      return (
        <svg viewBox="0 0 48 48" style={{ ...s, ...glow }} className={anim} aria-hidden>
          <g style={{ animation: 'portalSpin 10s linear infinite', transformOrigin: '24px 24px' }}>
            <polygon points="24,6 40,33 8,33" fill="none" stroke={hue} strokeWidth="1.3" />
            <polygon points="24,42 8,15 40,15" fill="none" stroke={hue} strokeWidth="1.3" opacity=".7" />
          </g>
          <circle cx="24" cy="24" r="4" fill={`${hue}66`} stroke={hue} strokeWidth="1.2" />
        </svg>
      );
  }
}

function Gear({ cx, cy, r, hue }: { cx: number; cy: number; r: number; hue: string }) {
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r * 0.75;
    pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
  }
  return (
    <>
      <polygon points={pts.join(' ')} fill="none" stroke={hue} strokeWidth="1.3" />
      <circle cx={cx} cy={cy} r={r * 0.32} fill="none" stroke={hue} strokeWidth="1.2" />
    </>
  );
}
