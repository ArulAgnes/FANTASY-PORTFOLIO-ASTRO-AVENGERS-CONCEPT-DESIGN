import { useEffect, useMemo, useRef, useState } from 'react';
import { Star, GitFork, ArrowUpRight, BookOpen, Boxes, Grid3X3, Search, FileCode2, Users, X } from 'lucide-react';
import { marked } from 'marked';
import { useApp } from '../hooks/app';
import { SectionHeading, StatusTag, Embers, GithubIcon } from './ui';
import MagneticButton from './MagneticButton';
import { useGithubRepos, useGithubProfile, fetchReadme, langHue, timeAgo, FALLBACK_REPOS } from '../lib/github';
import type { Repo } from '../lib/github';
import { SITE } from '../data/resume';

function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

export default function CodeVault() {
  const { repos, source } = useGithubRepos();
  const profile = useGithubProfile();
  const { reducedMotion, toast, sfx } = useApp();
  const [view, setView] = useState<'grid' | 'galaxy'>('grid');
  const [gq, setGq] = useState('');
  const [readme, setReadme] = useState<{ repo: string; html: string | null; loading: boolean; err: boolean } | null>(null);

  const shown = useMemo(() => (repos.length ? repos : FALLBACK_REPOS), [repos]);

  const openReadme = (r: Repo) => {
    setReadme({ repo: r.name, html: null, loading: true, err: false });
    fetchReadme(r.name, r.default_branch)
      .then((md) => setReadme({ repo: r.name, html: sanitize(marked.parse(md) as string), loading: false, err: false }))
      .catch(() => setReadme({ repo: r.name, html: null, loading: false, err: true }));
  };

  /* ESC closes the README docs viewer */
  useEffect(() => {
    if (!readme) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setReadme(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [readme]);

  return (
    <section id="vault" className="relative overflow-hidden px-4 py-28 md:px-10 md:py-40" aria-label="The Code Vault — GitHub">
      <img src="/images/code-vault.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.16]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/85 to-void" />
      <Embers count={8} hue="#41d9ff" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          scene="SCENE 06 — GITHUB COMMAND CENTER"
          kicker="THE COMPLETE REPOSITORY UNIVERSE"
          title="THE CODE"
          emberLine="VAULT"
          right="Projects above are the visual missions. This vault is the raw source — every public repository, discovered live from GitHub."
        />

        {/* profile card */}
        <div className="holo panel-clip mb-12 flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div className="relative">
            <img
              src={`https://github.com/${SITE.githubUser}.png`}
              alt={`GitHub avatar of ${SITE.name}`}
              className="h-20 w-20 rounded-full border-2 border-arc/50 object-cover"
              style={{ boxShadow: '0 0 40px -8px rgba(65,217,255,.7)' }}
              loading="lazy"
            />
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-void bg-ember text-void">
              <GithubIcon size={12} />
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-display text-2xl tracking-wider text-white">{profile?.name || 'ARUL AGNES'}</h3>
            <p className="font-mono text-[.6rem] tracking-[.3em] text-arc">github.com/{SITE.githubUser}</p>
            {profile?.bio && <p className="mt-2 max-w-xl text-[.74rem] leading-relaxed text-mist/85">{profile.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-4 font-mono text-[.58rem] tracking-[.2em] text-mist/70">
              <span className="flex items-center gap-1.5"><Boxes size={11} className="text-ember" /> {profile ? `${profile.public_repos} PUBLIC REPOS` : `${shown.length}+ REPOS KNOWN`}</span>
              {profile && <span className="flex items-center gap-1.5"><Users size={11} className="text-arc" /> {profile.followers} FOLLOWERS · {profile.following} FOLLOWING</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <MagneticButton variant="ember" small icon={<GithubIcon size={11} />} href={SITE.github} external>View GitHub</MagneticButton>
            <MagneticButton variant={view === 'galaxy' ? 'arc' : 'ghost'} small icon={view === 'galaxy' ? <Grid3X3 size={11} /> : <Boxes size={11} />} onClick={() => setView(view === 'galaxy' ? 'grid' : 'galaxy')}>
              {view === 'galaxy' ? 'Grid Mode' : 'Enter All Projects — Galaxy'}
            </MagneticButton>
          </div>
        </div>

        {/* source banner */}
        <div className="mb-8">
          <StatusTag tone={source === 'live' ? 'arc' : source === 'loading' ? 'ember' : source === 'cache' ? 'gild' : 'dim'}>
            {source === 'loading' && 'SCANNING CODE VAULT…'}
            {source === 'live' && 'LIVE GITHUB LINK ESTABLISHED'}
            {source === 'cache' && 'CACHED VAULT SNAPSHOT (< 30 MIN)'}
            {source === 'offline' && 'REPOSITORY CURRENTLY UNAVAILABLE — SHOWING KNOWN ARCHIVE'}
          </StatusTag>
        </div>

        {view === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
            {source === 'loading'
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="holo panel-clip h-44 animate-pulse p-5"><div className="mb-3 h-3 w-2/3 bg-white/10" /><div className="h-2 w-full bg-white/5" /><div className="mt-2 h-2 w-4/5 bg-white/5" /></div>
              ))
              : shown.map((r) => <RepoCard key={r.name} repo={r} onReadme={() => openReadme(r)} />)}
          </div>
        ) : (
          <Galaxy repos={shown} query={gq} setQuery={setGq} onReadme={openReadme} still={reducedMotion} />
        )}
        {/* classified vault gag — honest, no fabricated projects */}
        <div className="mt-14 text-center">
          <button
            onClick={() => { toast('ACCESS DENIED — CLEARANCE PENDING', 'warn'); sfx('error'); }}
            className="group inline-flex items-center gap-3 border border-white/10 bg-black/40 px-6 py-3 font-mono text-[.58rem] tracking-[.34em] text-mist/50 transition-all hover:border-gild/50 hover:text-gild"
            data-cursor="link"
            aria-label="Classified projects — locked vault"
          >
            <span className="inline-block h-2.5 w-2.5 rotate-45 border border-current" />
            CLASSIFIED PROJECTS
            <span className="text-[.44rem] tracking-[.2em] opacity-0 transition-opacity group-hover:opacity-100">ACCESS DENIED — MORE PROJECTS ARE BEING BUILT</span>
          </button>
        </div>
      </div>

      {/* README modal */}
      {readme && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center bg-void/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`README of ${readme.repo}`}>
          <div className="absolute inset-0" onClick={() => setReadme(null)} aria-hidden />
          <div className="holo panel-clip relative max-h-[88svh] w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-void/85 px-5 py-3">
              <span className="flex items-center gap-2 font-mono text-[.58rem] tracking-[.3em] text-arc"><FileCode2 size={13} /> README — {readme.repo}</span>
              <div className="flex items-center gap-2">
                <MagneticButton variant="ghost" small icon={<ArrowUpRight size={10} />} href={`${SITE.github}/${readme.repo}`} external>Open on GitHub</MagneticButton>
                <button onClick={() => setReadme(null)} aria-label="Close README" className="border border-white/10 px-2 py-1 font-mono text-[.55rem] text-mist hover:border-ember hover:text-ember" autoFocus data-cursor="link">ESC</button>
              </div>
            </div>
            <div className="no-bar max-h-[72svh] overflow-y-auto bg-black/40 p-6 md:p-8">
              {readme.loading && <p className="font-mono text-[.62rem] tracking-[.3em] text-ember2">RETRIEVING README FROM RAW GITHUB…</p>}
              {readme.err && (
                <div className="border border-gild/40 bg-gild/10 p-4">
                  <p className="font-mono text-[.62rem] tracking-[.2em] text-gild">README UNAVAILABLE FOR THIS REPOSITORY.</p>
                  <p className="mt-1 font-mono text-[.55rem] tracking-[.16em] text-mist/70">Use OPEN ON GITHUB to inspect the repository directly.</p>
                </div>
              )}
              {readme.html && (
                <>
                  <article className="gh-md" dangerouslySetInnerHTML={{ __html: readme.html }} />
                  <style>{`
                    .gh-md { font-size: .8rem; line-height: 1.7; color: #b9c9e4; font-family: var(--font-body); }
                    .gh-md h1, .gh-md h2, .gh-md h3 { font-family: var(--font-display); color: #fff; letter-spacing: .06em; margin: 1.2em 0 .5em; }
                    .gh-md h1 { font-size: 1.6rem; } .gh-md h2 { font-size: 1.2rem; } .gh-md h3 { font-size: 1rem; }
                    .gh-md p { margin: .6em 0; }
                    .gh-md a { color: #41d9ff; text-decoration: underline; }
                    .gh-md code { font-family: var(--font-mono); font-size: .72rem; background: rgba(65,217,255,.08); border: 1px solid rgba(65,217,255,.2); padding: .1em .4em; color: #a8ecff; }
                    .gh-md pre { background: rgba(0,0,0,.55); border: 1px solid rgba(255,122,26,.25); padding: 1em; overflow-x: auto; margin: .8em 0; }
                    .gh-md pre code { background: none; border: none; padding: 0; color: #ffd9ad; }
                    .gh-md ul, .gh-md ol { padding-left: 1.4em; margin: .6em 0; list-style: square; }
                    .gh-md img { max-width: 100%; border: 1px solid rgba(120,160,220,.2); margin: .8em 0; }
                    .gh-md blockquote { border-left: 2px solid #ff7a1a; padding-left: 1em; color: #9db2ce; }
                    .gh-md table { border-collapse: collapse; margin: .8em 0; }
                    .gh-md td, .gh-md th { border: 1px solid rgba(120,160,220,.2); padding: .4em .8em; }
                  `}</style>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- repo card ---------- */
function RepoCard({ repo, onReadme }: { repo: Repo; onReadme: () => void }) {
  const live = repo.homepage;
  return (
    <article className="holo panel-clip group relative flex flex-col p-5 transition-all duration-300 hover:border-ember/40 anim-rise">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-mono text-[.8rem] font-bold tracking-wider text-white transition-colors group-hover:text-ember2">{repo.name}</h3>
        <span className={`shrink-0 border px-1.5 py-0.5 font-mono text-[.42rem] tracking-[.2em] ${live ? 'border-arc/50 text-arc' : 'border-white/15 text-mist/50'}`}>
          {live ? 'LIVE' : 'SOURCE'}
        </span>
      </div>
      <p className="mb-4 min-h-[2.6em] text-[.72rem] leading-relaxed text-mist/80">{repo.description || 'No description provided.'}</p>
      {repo.topics.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map((t) => <span key={t} className="border border-vio/40 bg-vio/10 px-1.5 py-0.5 font-mono text-[.42rem] tracking-[.14em] text-vio">{t}</span>)}
        </div>
      )}
      <div className="mt-auto">
        <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[.52rem] tracking-[.14em] text-mist/60">
          {repo.language && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: langHue(repo.language) }} />{repo.language}</span>}
          <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazers_count}</span>
          <span className="flex items-center gap-1"><GitFork size={10} /> {repo.forks_count}</span>
          {repo.updated_at && <span>{timeAgo(repo.updated_at)}</span>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="chip !text-[.48rem] hover:border-ember hover:text-ember2" data-cursor="link" aria-label={`Source of ${repo.name}`}>SOURCE</a>
          <button onClick={onReadme} className="chip !text-[.48rem] hover:border-arc hover:text-arc" data-cursor="link">README</button>
          {live && <a href={live} target="_blank" rel="noopener noreferrer" className="chip !text-[.48rem] hover:border-arc hover:text-arc" data-cursor="link">LIVE</a>}
        </div>
      </div>
    </article>
  );
}

/* ---------- galaxy mode ---------- */
function Galaxy({ repos, query, setQuery, onReadme, still }: {
  repos: Repo[]; query: string; setQuery: (v: string) => void; onReadme: (r: Repo) => void; still: boolean;
}) {
  const [rot, setRot] = useState({ x: -12, y: 0 });
  const [sel, setSel] = useState<Repo | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const nodes = useMemo(() => {
    const n = repos.length;
    return repos.map((r, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(1, n));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const rad = 42;
      return {
        r,
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.cos(phi) * 0.7,
        z: rad * Math.sin(phi) * Math.sin(theta),
      };
    });
  }, [repos]);

  const match = (r: Repo) => !query.trim() || `${r.name} ${r.description || ''} ${r.language || ''}`.toLowerCase().includes(query.trim().toLowerCase());

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="flex min-w-[200px] items-center gap-3 border border-white/15 bg-black/40 px-4 py-2.5 focus-within:border-vio">
          <Search size={13} className="text-vio" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="SEARCH GALAXY — PHP · JAVASCRIPT · BOOK…"
            className="w-full bg-transparent font-mono text-[.6rem] tracking-[.16em] text-white outline-none placeholder:text-mist/40" aria-label="Search project galaxy" />
        </label>
        <span className="font-mono text-[.52rem] tracking-[.3em] text-mist/50">DRAG TO ROTATE · CLICK A STAR TO INSPECT</span>
      </div>

      <div
        className="relative h-[62svh] touch-none select-none overflow-hidden border border-vio/20 bg-[radial-gradient(ellipse_at_center,rgba(138,107,255,.1),rgba(4,6,12,.9)_70%)]"
        style={{ perspective: '900px' }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setRot((r) => ({ x: r.x - (e.clientY - drag.current!.y) * 0.25, y: r.y + (e.clientX - drag.current!.x) * 0.25 }));
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => { drag.current = null; }}
        role="application"
        aria-label="Rotatable 3D galaxy of repositories"
      >
        <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rot.x}deg) rotateY(${still ? 0 : rot.y}deg)` }}>
          {/* center star — the profile */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ transform: 'translate(-50%,-50%)' }}>
            <div className="mx-auto h-6 w-6 rounded-full bg-ember" style={{ boxShadow: '0 0 50px 10px rgba(255,122,26,.7)' }} />
            <div className="mt-2 font-mono text-[.5rem] tracking-[.3em] text-ember2">ARULAGNES</div>
          </div>
          {nodes.map(({ r, x, y, z }) => (
            <button
              key={r.name}
              onClick={() => setSel(r)}
              className="group absolute"
              style={{ transform: `translate3d(${x}vmin, ${y}vmin, ${z}vmin) translate(-50%,-50%)`, opacity: match(r) ? 1 : 0.12 }}
              aria-label={`Inspect repository ${r.name}`}
              data-cursor="project"
              tabIndex={match(r) ? 0 : -1}
            >
              <span className="block h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover:scale-[2]"
                style={{ background: langHue(r.language), boxShadow: `0 0 14px 2px ${langHue(r.language)}88` }} />
              <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap border border-white/15 bg-black/85 px-2 py-1 font-mono text-[.46rem] tracking-[.14em] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {r.name}
              </span>
            </button>
          ))}
        </div>

        {/* inspected repo panel */}
        {sel && (
          <div className="holo panel-clip absolute bottom-4 left-4 right-4 z-10 p-4 md:right-auto md:w-96 anim-rise" style={{ animationDuration: '.3s' }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-mono text-[.78rem] font-bold tracking-wider text-white">{sel.name}</h4>
                <p className="mt-1 text-[.68rem] text-mist/80">{sel.description || 'No description provided.'}</p>
              </div>
              <button onClick={() => setSel(null)} aria-label="Close repository panel" className="text-mist/50 hover:text-ember" data-cursor="link">
                <X size={14} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 font-mono text-[.5rem] tracking-[.14em] text-mist/60">
              {sel.language && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: langHue(sel.language) }} />{sel.language}</span>}
              <span className="flex items-center gap-1"><Star size={10} /> {sel.stargazers_count}</span>
              <span className="flex items-center gap-1"><GitFork size={10} /> {sel.forks_count}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={sel.html_url} target="_blank" rel="noopener noreferrer" className="chip !text-[.46rem] hover:border-ember hover:text-ember2" data-cursor="link">SOURCE</a>
              <button onClick={() => onReadme(sel)} className="chip !text-[.46rem] hover:border-arc hover:text-arc" data-cursor="link">README</button>
              {sel.homepage && <a href={sel.homepage} target="_blank" rel="noopener noreferrer" className="chip !text-[.46rem] hover:border-arc hover:text-arc" data-cursor="link">LIVE</a>}
              <span className="flex items-center gap-1.5 font-mono text-[.46rem] text-mist/50"><BookOpen size={10} /> docs via raw GitHub</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
