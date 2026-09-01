import { useEffect, useRef, useState } from 'react';
import { BookOpen, GraduationCap, School, Landmark, ArrowLeft } from 'lucide-react';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers } from './ui';
import MagneticButton from './MagneticButton';
import { EDUCATION } from '../data/resume';
import type { EduRecord } from '../data/resume';

const ICONS = { be: GraduationCap, hsc: School, sslc: Landmark } as const;

export default function KnowledgeArchive() {
  const { toast, sfx, reducedMotion } = useApp();
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const seen = useRef(false);
  const complete = unlocked.length === EDUCATION.length;

  useEffect(() => {
    const el = document.getElementById('knowledge');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !seen.current) {
        seen.current = true;
        toast('OPENING KNOWLEDGE ARCHIVE…', 'sys');
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [toast]);

  const openBook = () => {
    if (open) return;
    setOpen(true);
    sfx('page');
    toast('THE BOOK AWAKENS', 'power');
  };

  const unlock = (e: EduRecord) => {
    sfx('unlock');
    if (!unlocked.includes(e.id)) {
      const next = [...unlocked, e.id];
      setUnlocked(next);
      setActive(e.id);
      toast(next.length === EDUCATION.length ? 'KNOWLEDGE COMPLETE' : `PAGE UNLOCKED — ${e.page}`, next.length === EDUCATION.length ? 'power' : 'sys');
    } else {
      setActive(active === e.id ? null : e.id);
      sfx('page');
    }
  };

  return (
    <section id="knowledge" className="relative overflow-hidden px-4 py-28 md:px-10 md:py-40" aria-label="The Knowledge Archive — education">
      <img src="/images/knowledge-archive.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.2]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void" />
      <Embers count={14} hue="#e8b84b" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          scene="SCENE 07 — THE LIVING LIBRARY"
          kicker="ARUL'S JOURNEY · THE FOUNDATION"
          title="THE KNOWLEDGE"
          emberLine="ARCHIVE"
          right="A book older than the code it holds. Open it, unlock its three pages, and the timeline of the journey reveals itself."
        />

        {/* ============ THE BOOK ============ */}
        <div className="relative mx-auto mb-24 max-w-3xl" style={{ perspective: '1400px' }}>
          <button
            onClick={openBook}
            className="group relative mx-auto block w-full"
            aria-expanded={open}
            aria-label={open ? 'The education book is open' : 'Open the education book'}
            data-cursor="portal"
          >
            {/* pedestal glow */}
            <span className="absolute inset-x-10 -bottom-6 h-10 rounded-[50%] bg-gild/20 blur-2xl" aria-hidden />
            <div className="relative overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
              {/* closed cover */}
              <div
                className="relative mx-auto flex aspect-[4/2.9] w-full max-w-xl items-center justify-center border border-gild/40 bg-gradient-to-br from-[#181207] via-[#0d0a04] to-[#050403] transition-all duration-[1400ms] ease-[cubic-bezier(.6,0,.2,1)]"
                style={{
                  transformOrigin: 'left center',
                  transform: open ? 'rotateY(-160deg)' : 'rotateY(0deg)',
                  boxShadow: open ? '0 0 0 rgba(0,0,0,0)' : undefined,
                  animation: reducedMotion ? undefined : 'bookGlow 4s ease-in-out infinite',
                  backfaceVisibility: 'hidden',
                }}
              >
                <span className="absolute inset-3 border border-gild/25" aria-hidden />
                <span className="text-center">
                  <BookOpen size={30} className="mx-auto mb-3 text-gild transition-transform duration-500 group-hover:scale-125" />
                  <span className="block font-cinzel text-2xl font-bold tracking-[.3em] text-gild md:text-4xl">EDUCATION</span>
                  <span className="mt-1 block font-mono text-[.55rem] tracking-[.44em] text-gild/60">THE FOUNDATION</span>
                  {!open && <span className="mt-4 block font-mono text-[.5rem] tracking-[.36em] text-white/50 transition-colors group-hover:text-gild">[ CLICK / TAP TO OPEN ]</span>}
                </span>
              </div>

              {/* inside pages */}
              <div className="absolute inset-0 mx-auto flex aspect-[4/2.9] w-full max-w-xl flex-col items-center justify-center border border-gild/30 bg-gradient-to-br from-[#140f06] to-[#080604] p-6"
                style={{ transform: 'translateZ(-2px)', boxShadow: 'inset 0 0 80px rgba(232,184,75,.12)' }}
                aria-hidden={!open}
              >
                <div className="kicker text-gild/70">ARUL'S JOURNEY</div>
                <div className="my-3 h-px w-24 bg-gild/40" />
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[.48rem] tracking-[.2em] text-mist/70">
                  <span>2018—2019<br />SSLC</span>
                  <span>2019—2021<br />HSC</span>
                  <span>2021—2025<br />B.E CSE</span>
                </div>
                <div className="mt-3 font-mono text-[.44rem] tracking-[.3em] text-gild/50">LIGHT RISES FROM THE PAGES…</div>
              </div>
            </div>
          </button>
        </div>

        {/* ============ CARDS ============ */}
        {open && (
          <div className="grid gap-5 md:grid-cols-3">
            {EDUCATION.map((e, i) => {
              const isOpen = unlocked.includes(e.id);
              const isActive = active === e.id;
              const Icon = ICONS[e.id as keyof typeof ICONS];
              return (
                <button
                  key={e.id}
                  onClick={() => unlock(e)}
                  className={`group relative overflow-hidden border p-6 text-left transition-all duration-500 anim-rise md:p-7 ${
                    isActive ? 'border-gild bg-gild/10 shadow-[0_0_60px_-14px_rgba(232,184,75,.8)]' : isOpen ? 'border-gild/50 bg-gild/5' : 'border-white/10 bg-black/40 hover:border-gild/40'
                  }`}
                  style={{ animationDelay: `${i * 140}ms` }}
                  aria-expanded={isActive}
                  data-cursor="power"
                >
                  {/* page tab */}
                  <span className={`absolute right-0 top-0 border-b border-l px-3 py-1.5 font-mono text-[.48rem] tracking-[.3em] ${isOpen ? 'border-gild/40 text-gild' : 'border-white/10 text-mist/50'}`}>
                    {e.page}
                  </span>

                  <div className={`mb-4 inline-grid h-12 w-12 place-items-center border transition-all duration-500 ${isOpen ? 'border-gild bg-gild/15 text-gild' : 'border-white/15 text-mist/40'}`}>
                    <Icon size={20} />
                  </div>

                  <div className="mb-1 flex items-center gap-3">
                    <h3 className={`font-cinzel text-lg font-bold tracking-wider transition-colors ${isOpen ? 'text-white' : 'text-mist/40'}`}>{e.degree}</h3>
                  </div>

                  {!isOpen ? (
                    <p className="font-mono text-[.55rem] tracking-[.3em] text-mist/40">
                      <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full border border-mist/40" />
                      LOCKED — CLICK TO UNSEAL
                    </p>
                  ) : (
                    <div className="anim-rise" style={{ animationDuration: '.5s' }}>
                      <p className="text-[.78rem] leading-relaxed text-mist">{e.institution}</p>
                      <p className="mt-1 font-mono text-[.58rem] tracking-[.26em] text-gild/90">{e.period}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <div className="font-display text-4xl text-gild" style={{ textShadow: '0 0 26px rgba(232,184,75,.6)' }}>{e.result}</div>
                          <div className="font-mono text-[.46rem] tracking-[.3em] text-mist/60">{e.resultLabel}</div>
                        </div>
                        <span className="chip !text-[.44rem] border-gild/40 text-gild">UNLOCKED</span>
                      </div>
                      {isActive && (
                        <p className="anim-rise mt-4 border-t border-gild/20 pt-3 text-[.72rem] italic leading-relaxed text-mist/80" style={{ animationDuration: '.45s' }}>
                          {e.lore}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ============ TIMELINE + CGPA CORE ============ */}
        {complete && (
          <div className="mt-16 anim-rise" style={{ animationDuration: '.7s' }}>
            <div className="mb-6 flex justify-center"><StatusTag tone="gild">KNOWLEDGE COMPLETE — TIMELINE REVEALED</StatusTag></div>
            <div className="holo panel-clip relative overflow-hidden p-6 md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
                {/* timeline */}
                <div>
                  <div className="kicker text-gild mb-5">CHRONOLOGY OF THE ARCHIVE</div>
                  <div className="relative">
                    <span className="absolute bottom-[-2px] left-0 top-[-2px] w-px bg-gradient-to-b from-gild via-gild/40 to-transparent md:bottom-auto md:left-0 md:right-0 md:top-1/2 md:h-px md:w-auto md:bg-gradient-to-r" aria-hidden />
                    <div className="grid gap-6 md:grid-cols-4">
                      {[
                        ['2018', 'SSLC BEGINS'],
                        ['2019', 'SSLC — 91%'],
                        ['2021', 'HSC — 86.6%'],
                        ['2025', 'B.E CSE — 8.43 CGPA'],
                      ].map(([y, l], i) => (
                        <div key={y} className="relative pl-6 md:pl-0 md:pt-6">
                          <span className="absolute left-[-5px] top-1 h-2.5 w-2.5 rotate-45 border border-gild bg-void md:left-0 md:top-[-5px]" style={{ boxShadow: '0 0 12px rgba(232,184,75,.8)' }} aria-hidden />
                          <div className="font-display text-2xl text-gild/90 md:text-3xl" style={{ animationDelay: `${i * 100}ms` }}>{y}</div>
                          <div className="font-mono text-[.5rem] tracking-[.24em] text-mist/70">{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* core */}
                <div className="text-center">
                  <div className="relative mx-auto mb-3 h-28 w-28">
                    <div className="absolute inset-0 rounded-full border border-gild/40" style={{ animation: 'pulseCore 2.6s ease-in-out infinite' }} aria-hidden />
                    <div className="absolute inset-3 grid place-items-center rounded-full bg-[radial-gradient(circle_at_50%_40%,#f6dfa8,#e8b84b_45%,#4d3a08_85%)]" style={{ boxShadow: '0 0 70px -8px rgba(232,184,75,.8)' }}>
                      <span className="font-display text-2xl text-void">8.43</span>
                    </div>
                  </div>
                  <div className="font-mono text-[.5rem] tracking-[.34em] text-gild">KNOWLEDGE CORE</div>
                  <div className="font-mono text-[.42rem] tracking-[.26em] text-mist/50">B.E CSE CGPA · 2021—2025</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {open && !complete && (
          <p className="mt-8 text-center font-mono text-[.55rem] tracking-[.34em] text-mist/50">
            UNSEAL ALL {EDUCATION.length} PAGES TO COMPLETE THE ARCHIVE — {unlocked.length}/{EDUCATION.length}
          </p>
        )}

        {open && (
          <div className="mt-10 text-center">
            <MagneticButton variant="ghost" small icon={<ArrowLeft size={11} />} onClick={() => { setOpen(false); setUnlocked([]); setActive(null); sfx('page'); }}>
              Close the Book
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  );
}
