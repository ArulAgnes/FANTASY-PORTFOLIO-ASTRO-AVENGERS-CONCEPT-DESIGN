import { useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Search, Rocket, Play, Radar, ArrowUpRight, Star, GitFork } from 'lucide-react';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers, GithubIcon } from './ui';
import MagneticButton from './MagneticButton';
import { PROJECTS, SKILLS } from '../data/resume';
import type { Project } from '../data/resume';
import { useGithubRepos, langHue, timeAgo } from '../lib/github';
import type { Repo } from '../lib/github';

const FILTERS = ['ALL', 'PHP', 'DATABASE', 'JAVASCRIPT', 'FULL STACK', 'TOOLS', 'OTHER'] as const;
type Filter = typeof FILTERS[number];
const SORTS = ['RECENTLY UPDATED', 'NEWEST', 'OLDEST', 'LANGUAGE'] as const;
type Sort = typeof SORTS[number];

type Featured = Project & { repo?: Repo; isFeatured: true };
interface Plain { isFeatured: false; repo: Repo; }
type Entry = Featured | Plain;

function matchesFilter(e: Entry, f: Filter): boolean {
  if (f === 'ALL') return true;
  const lang = (e.repo?.language || '').toLowerCase();
  if (e.isFeatured) {
    const tech = e.tech.map((t) => t.toLowerCase());
    switch (f) {
      case 'PHP': return tech.includes('php');
      case 'DATABASE': return tech.some((t) => t.includes('mysql') || t.includes('postgres'));
      case 'JAVASCRIPT': return tech.includes('javascript');
      case 'FULL STACK': return tech.includes('php') && tech.some((t) => t.includes('mysql'));
      case 'TOOLS': case 'OTHER': return false;
    }
  }
  switch (f) {
    case 'PHP': return lang === 'php' || lang === 'blade';
    case 'DATABASE': return e.repo.topics.some((t) => /sql|database/.test(t));
    case 'JAVASCRIPT': return lang === 'javascript' || lang === 'typescript' || lang === 'html' || lang === 'css';
    case 'FULL STACK': return lang === 'php';
    case 'TOOLS': return ['dockerfile', 'shell', 'makefile'].includes(lang);
    case 'OTHER': return !['php', 'blade', 'javascript', 'typescript', 'html', 'css', 'dockerfile', 'shell'].includes(lang);
  }
  return true;
}

function haystack(e: Entry): string {
  return e.isFeatured
    ? `${e.name} ${e.subtitle} ${e.tech.join(' ')}`.toLowerCase()
    : `${e.repo.name} ${e.repo.description || ''} ${e.repo.language || ''} ${e.repo.topics.join(' ')}`.toLowerCase();
}

export default function Projects() {
  const { repos, source } = useGithubRepos();
  const { openProject, openSkill, toast } = useApp();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [sort, setSort] = useState<Sort>('RECENTLY UPDATED');
  const [q, setQ] = useState('');

  const entries = useMemo<Entry[]>(() => {
    const featured: Featured[] = PROJECTS.map((p) => ({
      ...p,
      isFeatured: true,
      repo: repos.find((r) => r.name.toLowerCase().includes(p.match)),
    }));
    const feats = featured.filter((f) => f.repo);
    const rest: Plain[] = repos
      .filter((r) => !PROJECTS.some((p) => r.name.toLowerCase().includes(p.match)))
      .map((repo) => ({ isFeatured: false, repo }));
    let list: Entry[] = [...feats, ...featured.filter((f) => !f.repo), ...rest];
    if (q.trim()) list = list.filter((e) => haystack(e).includes(q.trim().toLowerCase()));
    list = list.filter((e) => matchesFilter(e, filter));
    const by = {
      'RECENTLY UPDATED': (a: Entry, b: Entry) => (b.repo?.updated_at || '').localeCompare(a.repo?.updated_at || ''),
      'NEWEST': (a: Entry, b: Entry) => (b.repo?.created_at || '').localeCompare(a.repo?.created_at || ''),
      'OLDEST': (a: Entry, b: Entry) => (a.repo?.created_at || '').localeCompare(b.repo?.created_at || ''),
      'LANGUAGE': (a: Entry, b: Entry) => (a.repo?.language || 'zzz').localeCompare(b.repo?.language || 'zzz'),
    }[sort];
    return [...list].sort((a, b) => {
      const f = (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return f !== 0 ? f : by(a, b);
    });
  }, [repos, filter, sort, q]);

  const featuredList = entries.filter((e): e is Featured => e.isFeatured);
  const rest = entries.filter((e): e is Plain => !e.isFeatured);

  return (
    <section id="battleground" className="relative overflow-hidden px-4 py-28 md:px-10 md:py-40" aria-label="Project battleground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(138,107,255,.08),transparent_60%)]" />
      <Embers count={10} hue="#8a6bff" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          scene="SCENE 05 — THE COMMAND CENTER"
          kicker="EVERY PROJECT IS A MISSION · EVERY REPOSITORY CONTAINS THE SOURCE"
          title="PROJECT"
          emberLine="BATTLEGROUND"
          right="Three flagship missions discovered in the archives — plus live reinforcements pulled directly from the GitHub code vault."
        />

        {/* command strip */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <StatusTag tone={source === 'live' ? 'arc' : source === 'loading' ? 'ember' : source === 'cache' ? 'gild' : 'dim'}>
            {source === 'loading' && 'SCANNING CODE VAULT…'}
            {source === 'live' && `${repos.length} REPOSITORIES FOUND — LIVE LINK`}
            {source === 'cache' && `${repos.length} REPOSITORIES — CACHED LINK`}
            {source === 'offline' && 'LIVE LINK DOWN — SHOWING KNOWN ARCHIVE'}
          </StatusTag>
          <span className="font-mono text-[.52rem] tracking-[.3em] text-mist/40">DATA: api.github.com/users/ArulAgnes — no fabricated stats</span>
        </div>

        {/* controls */}
        <div className="mb-12 flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-3 border border-white/15 bg-black/40 px-4 py-2.5 focus-within:border-arc md:max-w-xs">
            <Search size={14} className="text-arc" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="SEARCH PROJECTS — PHP · BOOK · BILLING…"
              className="w-full bg-transparent font-mono text-[.62rem] tracking-[.18em] text-white outline-none placeholder:text-mist/40"
              aria-label="Search projects"
            />
          </label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button key={f} className="chip" data-on={filter === f} onClick={() => { setFilter(f); toast(f === 'ALL' ? 'ALL SECTORS VISIBLE' : `FILTER ENGAGED — ${f}`, 'sys'); }} data-cursor="link">
                {f}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-white/15 bg-black/60 px-3 py-2 font-mono text-[.6rem] tracking-[.2em] text-mist outline-none focus:border-arc"
            aria-label="Sort projects"
          >
            {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* ===== flagship gates ===== */}
        <div className="space-y-10">
          {featuredList.map((p, i) => (
            <GateCard key={p.id} p={p} flip={i % 2 === 1} onExplore={() => openProject(p.id)} onSkill={openSkill} />
          ))}
        </div>

        {/* ===== reinforcements ===== */}
        {rest.length > 0 && (
          <div className="mt-20">
            <div className="mb-6 flex items-center gap-4">
              <StatusTag tone="arc">REINFORCEMENTS FROM THE CODE VAULT</StatusTag>
              <span className="font-mono text-[.52rem] tracking-[.3em] text-mist/50">{rest.length} ADDITIONAL PUBLIC REPOSITORIES</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((e) => (
                <article key={e.repo.name} className="holo panel-clip group relative overflow-hidden p-5 transition-all duration-300 hover:border-arc/40 anim-rise">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-mono text-[.78rem] font-bold tracking-wider text-white transition-colors group-hover:text-arc">{e.repo.name}</h3>
                    <a href={e.repo.html_url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-mist/50 transition-colors hover:text-ember" aria-label={`Open ${e.repo.name} on GitHub`} data-cursor="link">
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                  <p className="mb-4 min-h-[2.4em] text-[.7rem] leading-relaxed text-mist/80">{e.repo.description || 'No description provided.'}</p>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[.55rem] tracking-[.14em] text-mist/60">
                    {e.repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: langHue(e.repo.language) }} />
                        {e.repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Star size={10} /> {e.repo.stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork size={10} /> {e.repo.forks_count}</span>
                    {e.repo.updated_at && <span>{timeAgo(e.repo.updated_at)}</span>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- flagship gate card ---------- */
function GateCard({ p, flip, onExplore, onSkill }: { p: Featured; flip: boolean; onExplore: () => void; onSkill: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isMobile } = useApp();
  const live = p.repo?.homepage || p.liveUrl;

  const tilt = (e: MouseEvent) => {
    if (isMobile || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
    if (imgRef.current) imgRef.current.style.transform = `scale(1.08) translate(${x * 14}px, ${y * 10}px)`;
  };
  const untilt = () => {
    if (ref.current) ref.current.style.transform = 'perspective(1200px)';
    if (imgRef.current) imgRef.current.style.transform = 'scale(1.02)';
  };

  return (
    <article
      ref={ref}
      onMouseMove={tilt}
      onMouseLeave={untilt}
      className="holo panel-clip group grid overflow-hidden transition-[transform,border-color] duration-200 ease-out hover:border-ember/30 md:grid-cols-2"
      style={{ transformStyle: 'preserve-3d' }}
      aria-label={`${p.name} — ${p.subtitle}`}
    >
      {/* image gate */}
      <button
        onClick={onExplore}
        className={`relative block h-64 overflow-hidden text-left md:h-auto md:min-h-[380px] ${flip ? 'md:order-2' : ''}`}
        aria-label={`Enter ${p.name} world`}
        data-cursor="project"
      >
        <img
          ref={imgRef}
          src={p.image}
          alt={`AI-generated concept visual for ${p.name}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
          style={{ transform: 'scale(1.02)' }}
          loading="lazy"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-void/40" aria-hidden />
        <span className="absolute bottom-3 left-3 border border-white/20 bg-black/60 px-2 py-1 font-mono text-[.46rem] tracking-[.26em] text-mist/80 backdrop-blur-sm">
          AI-GENERATED CONCEPT VISUAL
        </span>
        <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-ember/60 bg-ember/15 text-ember2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <Rocket size={16} />
        </span>
        <span className="absolute left-4 top-4 font-mono text-[.55rem] tracking-[.34em] text-ember2">{p.codename}</span>
      </button>

      {/* intel */}
      <div className="relative flex flex-col justify-center p-6 md:p-10">
        <div className="mb-2 flex items-center gap-3">
          <Radar size={13} className="text-arc" />
          <span className="font-mono text-[.55rem] tracking-[.3em] text-arc">{live ? 'STATUS: LIVE' : 'STATUS: SOURCE ONLY'}</span>
        </div>
        <h3 className="font-display text-3xl tracking-wide text-white transition-colors group-hover:text-ember2 md:text-5xl">{p.name}</h3>
        <p className="mt-1 font-mono text-[.6rem] tracking-[.24em] text-mist">{p.subtitle.toUpperCase()}</p>

        <ul className="mt-5 grid gap-1.5 text-[.72rem] text-mist/85 sm:grid-cols-2">
          {p.features.slice(0, 6).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-ember" /> {f}
            </li>
          ))}
        </ul>

        {/* tech constellation — links back to armory */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => {
            const sk = SKILLS.find((s) => s.name.toLowerCase() === t.toLowerCase());
            return (
              <button
                key={t}
                onClick={() => sk && onSkill(sk.id)}
                className="chip !text-[.5rem]"
                style={sk ? { borderColor: `${sk.hue}55`, color: sk.hue } : undefined}
                title={sk ? `Open ${sk.name} power chamber` : t}
                data-cursor={sk ? 'power' : 'link'}
              >
                {t}
              </button>
            );
          })}
        </div>

        {(p.repo && (p.repo.stargazers_count > 0 || p.repo.forks_count > 0)) && (
          <div className="mt-4 flex gap-4 font-mono text-[.55rem] tracking-[.18em] text-mist/60">
            <span className="flex items-center gap-1.5"><Star size={11} /> {p.repo.stargazers_count}</span>
            <span className="flex items-center gap-1.5"><GitFork size={11} /> {p.repo.forks_count}</span>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <MagneticButton variant="ember" small icon={<Play size={11} />} onClick={onExplore}>Play / Explore</MagneticButton>
          <MagneticButton variant="ghost" small icon={<GithubIcon size={11} />} href={p.github} external>View Source</MagneticButton>
          {live && <MagneticButton variant="arc" small icon={<ArrowUpRight size={11} />} href={live} external>Live Demo</MagneticButton>}
        </div>
      </div>
    </article>
  );
}
