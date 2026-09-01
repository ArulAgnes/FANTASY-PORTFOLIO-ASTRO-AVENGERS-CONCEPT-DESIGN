import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Server, GitBranch } from 'lucide-react';
import { useApp } from '../hooks/app';
import { GithubIcon } from './ui';
import MagneticButton from './MagneticButton';
import { PROJECTS, SKILLS } from '../data/resume';
import { BookBazzarSim, AstrologySim, PharmacySim } from './Simulations';
import { useGithubRepos } from '../lib/github';

export default function ProjectModal() {
  const { projectId, openProject, openSkill } = useApp();
  const { repos } = useGithubRepos();
  const idx = useMemo(() => PROJECTS.findIndex((p) => p.id === projectId), [projectId]);
  const [tab, setTab] = useState<'mission' | 'sim'>('mission');

  useEffect(() => { setTab('mission'); }, [projectId]);

  const p = idx >= 0 ? PROJECTS[idx] : null;
  const repo = p ? repos.find((r) => r.name.toLowerCase().includes(p.match)) : undefined;
  const live = repo?.homepage || p?.liveUrl;

  const cycle = (d: 1 | -1) => {
    const next = (idx + d + PROJECTS.length) % PROJECTS.length;
    openProject(PROJECTS[next].id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') openProject(null);
      if (e.key === 'ArrowRight') cycle(1);
      if (e.key === 'ArrowLeft') cycle(-1);
      if (e.key.toLowerCase() === 'd') setTab('sim');
      if (e.key.toLowerCase() === 'g' && p) window.open(p.github, '_blank', 'noopener');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); /* re-bind each render so closures stay fresh */

  if (!p) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-void/88 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${p.name} mission briefing`}>
      <div className="absolute inset-0" onClick={() => openProject(null)} aria-hidden />
      <div className="holo panel-clip relative flex max-h-[94svh] w-[min(1200px,96vw)] flex-col overflow-hidden anim-rise" style={{ animationDuration: '.45s' }}>
        {/* header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-void/85 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3 font-mono text-[.58rem] tracking-[.3em]">
            <span className="shrink-0 text-ember2">{p.codename}</span>
            <span className="hidden text-mist/50 sm:inline">— BRIEFING OPEN</span>
            <span className={`shrink-0 border px-2 py-0.5 text-[.5rem] ${live ? 'border-arc/50 text-arc' : 'border-white/20 text-mist/70'}`}>
              {live ? 'LIVE' : 'SOURCE ONLY'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => cycle(-1)} className="border border-white/10 p-1.5 text-mist hover:border-arc hover:text-arc" aria-label="Previous project (←)" data-cursor="link"><ChevronLeft size={14} /></button>
            <button onClick={() => cycle(1)} className="border border-white/10 p-1.5 text-mist hover:border-arc hover:text-arc" aria-label="Next project (→)" data-cursor="link"><ChevronRight size={14} /></button>
            <button onClick={() => openProject(null)} className="ml-1 border border-white/10 p-1.5 text-mist hover:border-ember hover:text-ember" aria-label="Close briefing (Esc)" autoFocus data-cursor="link"><X size={14} /></button>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-1 border-b border-white/10 bg-black/40 px-4 pt-2.5 md:px-6" role="tablist" aria-label="Project views">
          {([['mission', 'MISSION INTEL'], ['sim', 'PLAY SIMULATION  (D)']] as const).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`border-b-2 px-4 py-2 font-mono text-[.58rem] tracking-[.28em] transition-colors ${tab === k ? 'border-ember text-ember2' : 'border-transparent text-mist/60 hover:text-white'}`}
              data-cursor="link">
              {label}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="no-bar flex-1 overflow-y-auto">
          {tab === 'mission' ? (
            <div className="grid gap-0 lg:grid-cols-[42%_1fr]">
              {/* visual */}
              <div className="group relative min-h-[260px] overflow-hidden lg:min-h-full">
                <img src={p.image} alt={`AI-generated concept visual of the ${p.name} world`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-void/30 lg:bg-gradient-to-r lg:from-transparent lg:to-void/70" aria-hidden />
                <span className="absolute bottom-3 left-3 border border-white/20 bg-black/60 px-2 py-1 font-mono text-[.46rem] tracking-[.26em] text-mist/80">
                  AI-GENERATED CONCEPT VISUAL
                </span>
                {/* tech constellation overlay */}
                <div className="absolute right-4 top-4 hidden h-36 w-36 md:block" aria-hidden={false}>
                  <div className="relative h-full w-full" style={{ animation: 'portalSpin 22s linear infinite' }}>
                    {p.tech.slice(0, 6).map((t, i) => {
                      const a = (i / Math.min(6, p.tech.length)) * 360;
                      return (
                        <span key={t} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${a}deg) translate(58px) rotate(-${a}deg)` }}>
                          <span className="block whitespace-nowrap border border-arc/40 bg-black/70 px-1.5 py-0.5 font-mono text-[.42rem] tracking-[.12em] text-arc backdrop-blur-sm" style={{ animation: 'portalSpin 22s linear infinite reverse' }}>
                            {t}
                          </span>
                        </span>
                      );
                    })}
                    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember" style={{ boxShadow: '0 0 16px rgba(255,122,26,.9)' }} />
                  </div>
                </div>
              </div>

              {/* intel */}
              <div className="p-6 md:p-8">
                <h3 className="font-display text-3xl tracking-wide text-white md:text-5xl">{p.name}</h3>
                <p className="mt-1 font-mono text-[.62rem] tracking-[.26em] text-arc">{p.subtitle.toUpperCase()}</p>

                {/* workflow chain */}
                <div className="mt-6">
                  <div className="kicker kicker-ember mb-2">MISSION PIPELINE</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.workflow.map((w, i) => (
                      <span key={w} className="flex items-center gap-1.5">
                        <span className="chip !text-[.46rem] !px-2">{w}</span>
                        {i < p.workflow.length - 1 && <span className="text-ember/70">↓</span>}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="kicker mb-2">DOCUMENTED CAPABILITIES</div>
                  <ul className="grid gap-1.5 text-[.76rem] text-mist/90 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-arc" />{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="kicker mb-2">TECHNOLOGY CONSTELLATION — CLICK TO VISIT THE ARMORY</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => {
                      const sk = SKILLS.find((s) => s.name.toLowerCase() === t.toLowerCase());
                      return (
                        <button key={t}
                          onClick={() => { if (sk) { openProject(null); setTimeout(() => openSkill(sk.id), 120); } }}
                          className="chip !text-[.5rem] transition-transform hover:scale-105"
                          style={sk ? { borderColor: `${sk.hue}66`, color: sk.hue } : { opacity: .6 }}
                          data-cursor={sk ? 'power' : 'link'}
                          title={sk ? `Travel to ${sk.name} power chamber` : `${t} (supporting tool)`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {repo && (
                  <div className="mt-6 border border-white/10 bg-white/[.02] px-4 py-3 font-mono text-[.55rem] tracking-[.16em] text-mist/70">
                    REPO VERIFIED · BRANCH {repo.default_branch.toUpperCase()} · {repo.language || 'MIXED STACK'}

                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 md:p-8">
              {p.sim === 'bookbazzar' && <BookBazzarSim />}
              {p.sim === 'astrology' && <AstrologySim />}
              {p.sim === 'pharmacy' && <PharmacySim />}
            </div>
          )}
        </div>

        {/* footer controls */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-black/50 px-4 py-3.5 md:px-6">
          {live ? (
            <MagneticButton variant="arc" small icon={<ArrowUpRight size={11} />} href={live} external>Run Project — Live</MagneticButton>
          ) : (
            <span className="flex items-center gap-2 border border-gild/40 bg-gild/10 px-3 py-2 font-mono text-[.52rem] tracking-[.2em] text-gild">
              <Server size={11} /> SERVER REQUIRED — PHP + MYSQL (XAMPP)
            </span>
          )}
          <MagneticButton variant="ember" small onClick={() => setTab('sim')}>Play Simulation</MagneticButton>
          <MagneticButton variant="ghost" small icon={<GithubIcon size={11} />} href={p.github} external>View Source (G)</MagneticButton>
          <MagneticButton variant="ghost" small icon={<GitBranch size={11} />} href={`${p.github}/blob/${repo?.default_branch || 'main'}${'/README.md'}`} external>README</MagneticButton>
          <span className="ml-auto hidden font-mono text-[.48rem] tracking-[.3em] text-mist/40 lg:inline">← → SWITCH · D DEMO · G GITHUB · ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
}
