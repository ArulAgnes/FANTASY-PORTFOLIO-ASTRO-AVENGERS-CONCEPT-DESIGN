import { useEffect, useMemo, useState } from 'react';
import { X, ArrowLeft, Rocket } from 'lucide-react';
import { useApp } from '../hooks/app';
import CoreVisual from './CoreVisual';
import MagneticButton from './MagneticButton';
import { SKILLS, PROJECTS, SKILL_COMBOS } from '../data/resume';

const STAGES = ['LOCKED', 'INITIALIZING', 'POWERING', 'ACTIVE'];

export default function PowerDetail() {
  const { skillId, openSkill, openProject, reducedMotion, toast } = useApp();
  const skill = useMemo(() => SKILLS.find((s) => s.id === skillId) || null, [skillId]);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    if (!skill) return;
    if (reducedMotion) { setStage(STAGES.length); return; }
    let i = 0;
    const iv = window.setInterval(() => {
      i += 1;
      setStage(i);
      if (i >= STAGES.length) {
        window.clearInterval(iv);
        toast(`SKILL ONLINE — ${skill.name}`, 'power');
      }
    }, 420);
    return () => window.clearInterval(iv);
  }, [skill, reducedMotion, toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') openSkill(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSkill]);

  if (!skill) return null;
  const online = stage >= STAGES.length;
  const projects = PROJECTS.filter((p) => skill.projects.includes(p.id));
  const combos = SKILL_COMBOS.filter((c) => c.skills.includes(skill.id));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-void/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${skill.name} power chamber`}>
      <div className="absolute inset-0" onClick={() => openSkill(null)} aria-hidden />
      <div
        className="holo panel-clip relative max-h-[92svh] w-full max-w-5xl overflow-y-auto no-bar anim-rise"
        style={{ animationDuration: '.4s', boxShadow: `0 0 120px -30px ${skill.hue}55, inset 0 0 80px -40px ${skill.hue}22` }}
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-void/80 px-5 py-3 backdrop-blur-md md:px-8">
          <div className="font-mono text-[.58rem] tracking-[.34em]" style={{ color: skill.hue }}>
            POWER CHAMBER — {online ? 'SKILL ONLINE' : STAGES[Math.min(stage, STAGES.length - 1)]}
          </div>
          <button onClick={() => openSkill(null)} className="text-mist/70 hover:text-ember" aria-label="Close chamber" autoFocus data-cursor="link">
            <X size={17} />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
          {/* reactor visual */}
          <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden border-b border-white/10 p-8 md:border-b-0 md:border-r">
            <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 55%, ${skill.hue}26, transparent 65%)` }} aria-hidden />
            {/* activation ring */}
            <div className="relative mb-8">
              <div className="absolute inset-[-30px] rounded-full border transition-all duration-700"
                style={{ borderColor: online ? `${skill.hue}88` : 'rgba(120,160,220,.15)', boxShadow: online ? `0 0 60px -10px ${skill.hue}aa` : 'none', animation: online ? 'coreRing 8s linear infinite' : undefined }}
                aria-hidden />
              <div className="absolute inset-[-14px] rounded-full border border-dashed transition-all duration-700" style={{ borderColor: `${skill.hue}${online ? '66' : '22'}`, animation: 'portalSpin 14s linear infinite' }} aria-hidden />
              <div className={online ? 'scale-125 transition-transform duration-700' : 'opacity-40 grayscale transition-all duration-700'}>
                <CoreVisual element={skill.element} hue={skill.hue} size={120} alive={online && !reducedMotion} />
              </div>
            </div>

            {/* activation chain */}
            <div className="relative flex flex-wrap items-center justify-center gap-2">
              {skill.sequence.map((step, i) => {
                const lit = online || stage > i;
                return (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className="chip transition-all duration-500"
                      style={lit ? { borderColor: skill.hue, color: skill.hue, boxShadow: `0 0 18px -4px ${skill.hue}88`, opacity: 1 } : { opacity: .3 }}
                    >
                      {step}
                    </span>
                    {i < skill.sequence.length - 1 && <span className="font-mono text-[.55rem]" style={{ color: lit ? skill.hue : '#39465e' }}>↓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* intel */}
          <div className="p-6 md:p-9">
            <p className="kicker mb-2" style={{ color: skill.hue }}>{skill.core} · {skill.category}</p>
            <h3 className="font-display text-4xl tracking-wider text-white md:text-6xl" style={online ? { textShadow: `0 0 30px ${skill.hue}66` } : undefined}>
              {skill.name}
            </h3>
            <p className="mt-1 font-mono text-[.62rem] tracking-[.3em] text-mist">{skill.tagline.toUpperCase()}</p>
            <p className="mt-5 text-sm leading-relaxed text-mist/90">{skill.lore}</p>

            {projects.length > 0 && (
              <div className="mt-7">
                <div className="kicker kicker-ember mb-3">USED / RELATED PROJECTS</div>
                <div className="flex flex-wrap gap-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { openSkill(null); setTimeout(() => openProject(p.id), 120); }}
                      className="chip !text-[.55rem] flex items-center gap-2 transition-all hover:scale-105 hover:border-ember hover:text-ember2"
                      data-cursor="project"
                    >
                      <Rocket size={11} /> {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {combos.length > 0 && (
              <div className="mt-6">
                <div className="kicker mb-3">FUSION PATHS</div>
                <div className="space-y-2">
                  {combos.map((c) => (
                    <div key={c.result} className="border border-white/10 bg-white/[.02] px-3 py-2 font-mono text-[.56rem] tracking-[.2em] text-mist/80">
                      {c.skills.map((sid) => SKILLS.find((x) => x.id === sid)?.name).join(' + ')} → <span className="text-ember2">{c.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <MagneticButton variant="arc" small icon={<ArrowLeft size={12} />} onClick={() => openSkill(null)}>
                Return to Armory
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
