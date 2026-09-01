import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Globe, FileDown, FileWarning, Send } from 'lucide-react';
import { StatusTag, Embers, GithubIcon } from './ui';
import MagneticButton from './MagneticButton';
import { useApp } from '../hooks/app';
import { SITE } from '../data/resume';

export default function ContactPortal() {
  const [resumeState, setResumeState] = useState<'checking' | 'ready' | 'missing'>('checking');

  /* honest resume probe — never fakes a file */
  useEffect(() => {
    let dead = false;
    fetch(SITE.resumePath, { method: 'HEAD' })
      .then((r) => { if (!dead) setResumeState(r.ok ? 'ready' : 'missing'); })
      .catch(() => { if (!dead) setResumeState('missing'); });
    return () => { dead = true; };
  }, []);

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-28 md:px-10 md:py-44" aria-label="Contact portal">
      <img src="/images/contact-city.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.28]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      <Embers count={14} />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-8 flex justify-center"><span className="tag-scene">SCENE 09 — THE DIMENSIONAL GATE</span></div>

        {/* portal */}
        <PortalGraphic />

        <h2 className="mt-10 font-display text-[clamp(2.4rem,7.5vw,6rem)] leading-[.95] tracking-wide text-white">
          READY FOR THE
          <span className="block text-ember text-glow-ember">NEXT MISSION?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md font-mono text-[.64rem] leading-relaxed tracking-[.2em] text-mist/85">
          {SITE.name} — {SITE.role}. THE PORTAL IS OPEN. TRANSMISSIONS ANSWERED FAST.
        </p>

        <div className="mt-6 flex flex-col items-center gap-2 font-mono text-[.66rem] tracking-[.18em] text-mist md:flex-row md:justify-center md:gap-6">
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 transition-colors hover:text-ember2" data-cursor="link"><Mail size={13} className="text-ember" /> {SITE.email}</a>
          <a href={SITE.phoneHref} className="flex items-center gap-2 transition-colors hover:text-arc" data-cursor="link"><Phone size={13} className="text-arc" /> {SITE.phone}</a>
          <span className="flex items-center gap-2"><MapPin size={13} className="text-vio" /> {SITE.location}</span>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton variant="ember" icon={<Send size={13} />} href={`mailto:${SITE.email}?subject=New%20Mission%20for%20Arul`}>Email Arul</MagneticButton>
          <MagneticButton variant="arc" icon={<Phone size={13} />} href={SITE.phoneHref}>Call</MagneticButton>
          <MagneticButton variant="ghost" icon={<GithubIcon size={13} />} href={SITE.github} external>GitHub</MagneticButton>
          <MagneticButton variant="gild" icon={<Globe size={13} />} href={SITE.portfolioUrl} external>Enter Current Portfolio</MagneticButton>
        </div>

        {/* mission file — resume */}
        <div className="holo panel-clip mx-auto mt-14 max-w-xl p-6 text-left md:p-7" aria-label="Mission file — resume download">
          <div className="mb-4 flex items-center justify-between">
            <StatusTag tone="ember">MISSION FILE — CLASSIFIED</StatusTag>
            <span className="font-mono text-[.48rem] tracking-[.3em] text-mist/40">{SITE.resumePath}</span>
          </div>
          <h3 className="font-cinzel text-lg font-bold tracking-[.16em] text-white">DOSSIER — {SITE.name}</h3>
          <p className="mt-1 font-mono text-[.55rem] tracking-[.2em] text-mist/70">FULL RESUME · EDUCATION · PROJECTS · CERTIFICATIONS</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {resumeState === 'ready' && (
              <MagneticButton variant="ember" small icon={<FileDown size={12} />} href={SITE.resumePath} download>Download Resume</MagneticButton>
            )}
            {resumeState === 'missing' && (
              <>
                <span className="flex items-center gap-2 border border-gild/40 bg-gild/10 px-3 py-2 font-mono text-[.52rem] tracking-[.18em] text-gild">
                  <FileWarning size={11} /> MISSION FILE NOT DEPLOYED YET
                </span>
                <MagneticButton variant="ghost" small icon={<Mail size={11} />} href={`mailto:${SITE.email}?subject=Resume%20Request`}>Request via Email</MagneticButton>
              </>
            )}
            {resumeState === 'checking' && (
              <span className="font-mono text-[.52rem] tracking-[.3em] text-mist/50">SCANNING FOR FILE…</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Concentric dimensional portal — pure CSS/SVG energy */
function PortalGraphic() {
  const { reducedMotion, toast, sfx } = useApp();
  return (
    <button
      className="group relative mx-auto block h-40 w-40 md:h-48 md:w-48"
      onClick={() => { sfx('portal'); toast('PORTAL STABLE — CHANNEL OPEN', 'power'); }}
      aria-label="Contact portal"
      data-cursor="portal"
    >
      <span className="absolute inset-0 rounded-full border border-ember/30" style={reducedMotion ? undefined : { animation: 'pulseCore 3s ease-in-out infinite' }} aria-hidden />
      <span className="absolute inset-3 rounded-full border border-arc/25" style={reducedMotion ? undefined : { animation: 'pulseCore 3s ease-in-out .4s infinite' }} aria-hidden />
      <span className="absolute inset-0 rounded-full border-t-2 border-ember" style={reducedMotion ? undefined : { animation: 'spin 4s linear infinite' }} aria-hidden />
      <span className="absolute inset-[-8px] rounded-full border-b-2 border-arc/60" style={reducedMotion ? undefined : { animation: 'spin 7s linear infinite reverse' }} aria-hidden />
      <span className="absolute inset-7 rounded-full transition-transform duration-500 group-hover:scale-110" style={{ background: 'conic-gradient(from 0deg, rgba(255,122,26,.5), rgba(65,217,255,.45), rgba(138,107,255,.4), rgba(255,122,26,.5))', filter: 'blur(6px)', animation: reducedMotion ? undefined : 'portalSpin 9s linear infinite' }} aria-hidden />
      <span className="absolute inset-10 rounded-full bg-void/90 backdrop-blur-sm" aria-hidden />
      <span className="absolute inset-0 grid place-items-center">
        <Mail size={22} className="text-white transition-all duration-300 group-hover:scale-125 group-hover:text-ember2" />
      </span>
    </button>
  );
}
