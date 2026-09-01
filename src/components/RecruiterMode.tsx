import { Mail, Phone, MapPin, ExternalLink, FileText, Award, Briefcase, GraduationCap, Boxes, User, Languages } from 'lucide-react';
import { useApp } from '../hooks/app';
import { GithubIcon } from './ui';
import { SITE, SKILLS, PROJECTS, EXPERIENCE, EDUCATION, CERTIFICATIONS, LANGUAGES, SOFT_SKILLS } from '../data/resume';
import { useGithubRepos, langHue, timeAgo } from '../lib/github';

/* Fast, clean, printable professional view — same data, zero theatrics. */
export default function RecruiterMode() {
  const { repos, source } = useGithubRepos();
  const { setMode } = useApp();
  const cats = [...new Set(SKILLS.map((s) => s.category))];
  const extraRepos = repos.filter((r) => !PROJECTS.some((p) => r.name.toLowerCase().includes(p.match)));

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-200" style={{ fontFamily: 'var(--font-body)' }}>
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">{SITE.name}</h1>
            <p className="text-xs text-amber-500/90">{SITE.role}</p>
          </div>
          <nav className="hidden gap-5 text-xs text-slate-400 md:flex" aria-label="Recruiter quick nav">
            {[['Summary', '#r-summary'], ['Skills', '#r-skills'], ['Experience', '#r-exp'], ['Projects', '#r-proj'], ['Education', '#r-edu'], ['Certifications', '#r-cert'], ['Contact', '#r-contact']].map(([l, h]) => (
              <a key={h} href={h} className="hover:text-white">{l}</a>
            ))}
          </nav>
          <button onClick={() => setMode('cinematic')} className="border border-amber-500/50 px-3 py-1.5 text-[.62rem] font-semibold tracking-[.2em] text-amber-400 hover:bg-amber-500/10">
            CINEMATIC MODE
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        {/* summary */}
        <Section id="r-summary" icon={<User size={15} />} title="Summary">
          <p className="text-sm leading-relaxed text-slate-300">
            PHP Web Developer with hands-on experience building dynamic and responsive web applications.
            Skilled in PHP, Laravel, MySQL, JavaScript, HTML, CSS and Bootstrap, with experience across backend logic,
            MVC architecture, UI design, authentication, API integration, database modeling and deployment workflows.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-sky-400" /> {SITE.location}</span>
            <a className="flex items-center gap-1.5 hover:text-white" href={`mailto:${SITE.email}`}><Mail size={12} className="text-sky-400" /> {SITE.email}</a>
            <a className="flex items-center gap-1.5 hover:text-white" href={SITE.phoneHref}><Phone size={12} className="text-sky-400" /> {SITE.phone}</a>
            <a className="flex items-center gap-1.5 hover:text-white" href={SITE.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={12} /> github.com/{SITE.githubUser}</a>
            <a className="flex items-center gap-1.5 hover:text-white" href={SITE.portfolioUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} className="text-sky-400" /> arul-portfolio-taupe.vercel.app</a>
          </div>
        </Section>

        {/* skills */}
        <Section id="r-skills" icon={<Boxes size={15} />} title="Skills">
          <div className="space-y-3">
            {cats.map((c) => (
              <div key={c} className="flex flex-wrap items-baseline gap-2">
                <span className="w-28 shrink-0 text-[.62rem] font-semibold tracking-[.2em] text-slate-500">{c}</span>
                <span className="flex flex-wrap gap-1.5">
                  {SKILLS.filter((s) => s.category === c).map((s) => (
                    <span key={s.id} className="rounded border border-white/10 bg-white/[.04] px-2 py-0.5 text-[.68rem] text-slate-200" title={s.tagline}>
                      {s.name}
                    </span>
                  ))}
                </span>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline gap-2 pt-1">
              <span className="w-28 shrink-0 text-[.62rem] font-semibold tracking-[.2em] text-slate-500">SOFT SKILLS</span>
              <span className="flex flex-wrap gap-1.5">
                {SOFT_SKILLS.map((s) => <span key={s.id} className="rounded border border-white/10 bg-white/[.04] px-2 py-0.5 text-[.68rem] text-slate-200">{s.name}</span>)}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="w-28 shrink-0 text-[.62rem] font-semibold tracking-[.2em] text-slate-500">LANGUAGES</span>
              <span className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((l) => <span key={l.name} className="rounded border border-white/10 bg-white/[.04] px-2 py-0.5 text-[.68rem] text-slate-200">{l.name} — {l.level}</span>)}
              </span>
            </div>
          </div>
        </Section>

        {/* experience */}
        <Section id="r-exp" icon={<Briefcase size={15} />} title="Experience">
          <div className="rounded border border-white/10 bg-white/[.02] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold text-white">{EXPERIENCE.role} — {EXPERIENCE.company}</h3>
              <span className="text-xs text-amber-400/90">{EXPERIENCE.period}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
              {EXPERIENCE.objectives.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
        </Section>

        {/* projects */}
        <Section id="r-proj" icon={<FileText size={15} />} title={`Projects ${repos.length ? `· ${repos.length} public repositories` : ''}`}>
          <div className="space-y-4">
            {PROJECTS.map((p) => {
              const r = repos.find((x) => x.name.toLowerCase().includes(p.match));
              return (
                <article key={p.id} className="rounded border border-white/10 bg-white/[.02] p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-white">{p.name} <span className="text-xs font-normal text-slate-500">— {p.subtitle}</span></h3>
                    {r && <span className="text-[.62rem] text-slate-500">updated {timeAgo(r.updated_at)} · ★ {r.stargazers_count} · ⑂ {r.forks_count}</span>}
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{p.features.slice(0, 4).join(' · ')}.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => <span key={t} className="rounded bg-sky-400/10 px-2 py-0.5 text-[.62rem] text-sky-300">{t}</span>)}
                  </div>
                  <div className="mt-3 flex gap-4 text-xs">
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-amber-400/90 hover:text-amber-300"><ExternalLink size={11} /> Source</a>
                    {(r?.homepage) && <a href={r.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-400 hover:text-sky-300"><ExternalLink size={11} /> Live</a>}
                  </div>
                </article>
              );
            })}
          </div>
          {extraRepos.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold tracking-[.2em] text-slate-500">
                MORE ON GITHUB {source === 'live' ? '(LIVE)' : source === 'cache' ? '(CACHED)' : source === 'offline' ? '(ARCHIVE)' : ''}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {extraRepos.map((r) => (
                  <a key={r.name} href={r.html_url} target="_blank" rel="noopener noreferrer" className="group rounded border border-white/10 p-3 hover:border-sky-400/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-sky-300">{r.name}</span>
                      {r.language && <span className="flex items-center gap-1 text-[.6rem] text-slate-500"><span className="h-2 w-2 rounded-full" style={{ background: langHue(r.language) }} />{r.language}</span>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{r.description || 'No description.'}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* education */}
        <Section id="r-edu" icon={<GraduationCap size={15} />} title="Education">
          <div className="space-y-3">
            {EDUCATION.map((e) => (
              <div key={e.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded border border-white/10 bg-white/[.02] p-4">
                <div>
                  <h3 className="font-semibold text-white">{e.degree}</h3>
                  <p className="text-sm text-slate-400">{e.institution}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-400/90">{e.result}{' '}
                    <span className="text-[.6rem] font-normal text-slate-500">{e.resultLabel}</span>
                  </div>
                  <div className="text-xs text-slate-500">{e.period}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* certifications */}
        <Section id="r-cert" icon={<Award size={15} />} title="Certifications">
          <div className="space-y-3">
            {CERTIFICATIONS.map((c) => (
              <div key={c.id} className="rounded border border-white/10 bg-white/[.02] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-white">{c.title}</h3>
                  <span className="text-xs text-amber-400/90">{c.date}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{c.org}</p>
                <p className="text-xs text-slate-500">{c.under}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* contact */}
        <Section id="r-contact" icon={<Languages size={15} />} title="Contact">
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${SITE.email}`} className="rounded border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-amber-300 hover:bg-amber-500/20">EMAIL</a>
            <a href={SITE.phoneHref} className="rounded border border-white/15 px-4 py-2 text-xs font-semibold tracking-wider text-slate-200 hover:border-sky-400/50">CALL</a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="rounded border border-white/15 px-4 py-2 text-xs font-semibold tracking-wider text-slate-200 hover:border-sky-400/50">GITHUB</a>
            <a href={SITE.portfolioUrl} target="_blank" rel="noopener noreferrer" className="rounded border border-white/15 px-4 py-2 text-xs font-semibold tracking-wider text-slate-200 hover:border-sky-400/50">PORTFOLIO</a>
          </div>
        </Section>

        <footer className="mt-14 border-t border-white/10 pt-6 text-center text-[.62rem] tracking-[.2em] text-slate-500">
          {SITE.name} · {SITE.role} · DATA VERIFIED AGAINST RESUME · NO FABRICATED STATISTICS
        </footer>
      </main>
    </div>
  );
}

function Section({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <h2 className="mb-4 flex items-center gap-2 border-b border-white/10 pb-2 text-sm font-bold tracking-[.22em] text-slate-100 uppercase">
        <span className="text-amber-500/90">{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}
