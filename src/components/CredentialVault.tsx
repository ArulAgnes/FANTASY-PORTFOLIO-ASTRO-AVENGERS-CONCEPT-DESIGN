import { useState } from 'react';
import { ShieldCheck, Cloud, ScanLine, Award, Waves, Radio } from 'lucide-react';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers } from './ui';
import { CERTIFICATIONS, LANGUAGES, SOFT_SKILLS } from '../data/resume';

const GLYPHS = { shield: ShieldCheck, cloud: Cloud } as const;

export default function CredentialVault() {
  const { toast, sfx } = useApp();
  const [scanned, setScanned] = useState<string[]>([]);

  const scan = (id: string) => {
    if (scanned.includes(id)) return;
    sfx('unlock');
    const next = [...scanned, id];
    setScanned(next);
    toast(next.length === CERTIFICATIONS.length ? 'CREDENTIAL VAULT FULLY VERIFIED' : 'CREDENTIAL VERIFIED', 'power');
  };

  return (
    <section id="credentials" className="relative overflow-hidden px-4 py-28 md:px-10 md:py-40" aria-label="Credential vault — certifications">
      <img src="/images/credential-vault.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.16]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/85 to-void" />
      <Embers count={8} hue="#e8b84b" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          scene="SCENE 08 — THE ACHIEVEMENT VAULT"
          kicker="HOLOGRAPHIC ARTIFACTS · SCANNED & VERIFIED"
          title="CREDENTIAL"
          emberLine="VAULT"
          right="Two verified artifacts float in containment. Touch a chamber to run the scan and reveal its record."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {CERTIFICATIONS.map((c, i) => {
            const isScanned = scanned.includes(c.id);
            const Glyph = GLYPHS[c.glyph as keyof typeof GLYPHS];
            return (
              <button
                key={c.id}
                onClick={() => scan(c.id)}
                className={`group holo panel-clip relative overflow-hidden p-7 text-left transition-all duration-500 md:p-9 ${isScanned ? 'border-gild/50' : 'hover:border-gild/30'}`}
                aria-expanded={isScanned}
                data-cursor="power"
              >
                {/* scan line */}
                {!isScanned && (
                  <span className="pointer-events-none absolute inset-x-0 top-[-5%] h-10 bg-gradient-to-b from-gild/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" style={{ animation: 'scanY 2.8s ease-in-out infinite' }} aria-hidden />
                )}
                <div className="mb-5 flex items-start justify-between">
                  <div className={`grid h-14 w-14 place-items-center border transition-all duration-500 ${isScanned ? 'border-gild bg-gild/15 text-gild' : 'border-white/15 text-mist/50 group-hover:text-gild'}`}>
                    <Glyph size={22} />
                  </div>
                  <StatusTag tone={isScanned ? 'gild' : 'dim'}>{isScanned ? 'VERIFIED' : 'SEALED'}</StatusTag>
                </div>

                {isScanned ? (
                  <div className="anim-rise" style={{ animationDuration: '.5s' }}>
                    <h3 className="font-cinzel text-xl font-bold tracking-wider text-white">{c.title}</h3>
                    <p className="mt-2 text-[.8rem] text-mist">{c.org}</p>
                    <p className="mt-1 font-mono text-[.55rem] tracking-[.2em] text-mist/60">{c.under}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-gild/20 pt-4">
                      <span className="font-mono text-[.56rem] tracking-[.3em] text-gild">{c.date.toUpperCase()}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[.5rem] tracking-[.2em] text-gild/80"><Award size={11} /> ARTIFACT {String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-cinzel text-lg font-bold tracking-wider text-mist/50">ARTIFACT {String(i + 1).padStart(2, '0')} — SEALED</h3>
                    <p className="mt-2 flex items-center gap-2 font-mono text-[.55rem] tracking-[.3em] text-mist/40">
                      <ScanLine size={12} className="text-gild/60" /> TAP CHAMBER TO SCAN
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ================ HUMAN PROTOCOLS ================ */}
        <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* languages */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <StatusTag tone="arc">COMMUNICATION CHAMBER</StatusTag>
            </div>
            <div className="space-y-4">
              {LANGUAGES.map((l) => (
                <div key={l.name} className="holo panel-clip group relative overflow-hidden p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="relative grid h-12 w-12 place-items-center rounded-full border border-arc/40">
                        <span className="absolute inset-0 rounded-full border border-arc/25" style={{ animation: 'pulseCore 2.4s ease-in-out infinite' }} aria-hidden />
                        <Radio size={16} className="text-arc" />
                      </span>
                      <div>
                        <div className="font-cinzel text-base font-bold tracking-[.2em] text-white">{l.name}</div>
                        <div className="font-mono text-[.5rem] tracking-[.26em] text-arc">{l.level.toUpperCase()}</div>
                      </div>
                    </div>
                    {/* waves */}
                    <svg width="72" height="26" viewBox="0 0 72 26" aria-hidden className="text-arc/70">
                      {[0, 1, 2].map((k) => (
                        <path key={k} d="M2 13 q8 -10 16 0 t16 0 t16 0 t16 0" fill="none" stroke="currentColor" strokeWidth="1.2" opacity={1 - k * 0.3}
                          strokeDasharray="4 4" style={{ animation: `dashFlow ${2.2 + k}s linear infinite`, transform: `translateY(${(k - 1) * 5}px)` }} />
                      ))}
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* soft skills */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <StatusTag tone="ember">ABILITY MODULES — HUMAN PROTOCOLS</StatusTag>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SOFT_SKILLS.map((s, i) => (
                <div key={s.id} className="holo panel-clip group relative overflow-hidden p-5 transition-all duration-300 hover:border-ember/40">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[.5rem] tracking-[.3em] text-mist/50">MODULE 0{i + 1}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-ember opacity-0 transition-opacity group-hover:opacity-100" style={{ boxShadow: '0 0 10px #ff7a1a' }} aria-hidden />
                  </div>
                  <div className="font-cinzel text-base font-bold tracking-[.14em] text-white">{s.name}</div>
                  <p className="mt-1.5 text-[.7rem] leading-relaxed text-mist/80">{s.lore}</p>
                  <svg className="mt-3 h-4 w-full text-ember/50" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                    <path d="M0 6 h40 l6 -5 h20 l6 10 h24 l6 -5 h98" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" style={{ animation: 'dashFlow 5s linear infinite' }} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-center gap-3 text-center">
          <Waves size={13} className="text-arc/50" />
          <span className="font-mono text-[.52rem] tracking-[.34em] text-mist/40">NO INVENTED SCORES — ONLY DOCUMENTED FACTS, RENDERED AS ARTIFACTS</span>
        </div>
      </div>
    </section>
  );
}
