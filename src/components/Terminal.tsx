import { useEffect, useRef, useState } from 'react';
import { X, Terminal as TermIcon } from 'lucide-react';
import { useApp } from '../hooks/app';
import { PROJECTS, SKILLS, EDUCATION, EXPERIENCE, SITE } from '../data/resume';

interface Line { text: string; kind: 'in' | 'out' | 'ok' | 'err'; }

const WELCOME: Line[] = [
  { text: 'AGNESVERSE SYSTEM TERMINAL v2.0', kind: 'ok' },
  { text: 'Fictional frontend terminal — no system commands are executed.', kind: 'out' },
  { text: "Type 'help' to list commands.", kind: 'out' },
];

export default function Terminal() {
  const { terminalOpen, setTerminalOpen, devMode } = useApp();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [val, setVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      if (devMode) setLines((l) => [...l, { text: 'DEVELOPER MODE ACTIVE — hidden core resonance detected.', kind: 'ok' }]);
    }
  }, [terminalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: Line[] = [{ text: `agnes@verse:~$ ${raw}`, kind: 'in' }];
    switch (cmd) {
      case 'help':
        out.push({ text: 'help · skills · projects · experience · education · certifications · contact · github · whoami · clear · exit', kind: 'out' });
        break;
      case 'whoami':
        out.push({ text: `${SITE.name} — ${SITE.role}`, kind: 'ok' }, { text: SITE.tagline, kind: 'out' });
        break;
      case 'skills':
        out.push({ text: SKILLS.map((s) => `${s.name} [${s.core}]`).join('  ·  '), kind: 'out' });
        break;
      case 'projects':
        PROJECTS.forEach((p) => out.push({ text: `» ${p.name} — ${p.subtitle}`, kind: 'out' }, { text: `  ${p.github}`, kind: 'ok' }));
        break;
      case 'experience':
        out.push({ text: `${EXPERIENCE.role} @ ${EXPERIENCE.company} — ${EXPERIENCE.period}`, kind: 'out' });
        break;
      case 'education':
        EDUCATION.forEach((e) => out.push({ text: `» ${e.degree} — ${e.institution} (${e.period}) — ${e.resultLabel} ${e.result}`, kind: 'out' }));
        break;
      case 'certifications':
        out.push({ text: '» Application Developer — Web & Mobile (IT-ITES SSC / NASSCOM, PMKVY) — June 2024', kind: 'out' });
        out.push({ text: '» Mastering AWS — A Step-by-Step Guide to Cloud Computing — Oct–Nov 2024', kind: 'out' });
        break;
      case 'contact':
        out.push({ text: `${SITE.email} · ${SITE.phone} · ${SITE.location}`, kind: 'out' });
        break;
      case 'github':
        out.push({ text: SITE.github, kind: 'ok' });
        break;
      case 'clear':
        setLines([]);
        setVal('');
        return;
      case 'exit':
        setTerminalOpen(false);
        setVal('');
        return;
      case '':
        break;
      default:
        out.push({ text: `command not found: ${cmd} — type 'help'`, kind: 'err' });
    }
    setLines((l) => [...l, ...out]);
    setVal('');
  };

  if (!terminalOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[140] p-3 md:p-6" role="dialog" aria-label="Developer terminal">
      <div className="holo panel-clip mx-auto max-w-3xl overflow-hidden anim-rise" style={{ animationDuration: '.3s' }}>
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[.03] px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-[.58rem] tracking-[.3em] text-arc">
            <TermIcon size={13} /> AGNESVERSE TERMINAL
            <span className="text-mist/30">— FRONTEND ONLY</span>
          </div>
          <button onClick={() => setTerminalOpen(false)} aria-label="Close terminal" className="text-mist/60 hover:text-ember" data-cursor="link">
            <X size={15} />
          </button>
        </div>
        <div ref={bodyRef} className="no-bar h-56 overflow-y-auto bg-black/50 p-4 font-mono text-[.68rem] leading-relaxed md:h-64">
          {lines.map((l, i) => (
            <div key={i} className={l.kind === 'in' ? 'text-gild' : l.kind === 'ok' ? 'text-arc' : l.kind === 'err' ? 'text-red-300' : 'text-mist'}>
              {l.text}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2 text-gild">
            <span className="shrink-0">agnes@verse:~$</span>
            <input
              ref={inputRef}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') run(val); if (e.key === 'Escape') setTerminalOpen(false); }}
              className="w-full bg-transparent text-white outline-none placeholder:text-mist/30"
              placeholder="help"
              aria-label="Terminal input"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
