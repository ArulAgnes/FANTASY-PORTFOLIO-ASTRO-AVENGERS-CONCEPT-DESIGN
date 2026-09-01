import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import type Lenis from 'lenis';
import { blip, setSoundEnabled } from '../lib/sound';
import type { BlipKind } from '../lib/sound';

export type Mode = 'cinematic' | 'recruiter';

export interface Toast { id: number; msg: string; tone: 'sys' | 'power' | 'warn'; }

interface AppState {
  mode: Mode;
  setMode: (m: Mode) => void;
  booted: boolean;
  setBooted: (b: boolean) => void;
  sound: boolean;
  toggleSound: () => void;
  sfx: (k?: BlipKind) => void;
  reducedMotion: boolean;
  isMobile: boolean;
  lenisRef: MutableRefObject<Lenis | null>;
  scrollTo: (target: string) => void;
  skillId: string | null;
  openSkill: (id: string | null) => void;
  projectId: string | null;
  openProject: (id: string | null) => void;
  terminalOpen: boolean;
  setTerminalOpen: (b: boolean) => void;
  mapOpen: boolean;
  setMapOpen: (b: boolean) => void;
  toasts: Toast[];
  toast: (msg: string, tone?: Toast['tone']) => void;
  devMode: boolean;
  unlockDevMode: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('cinematic');
  const [booted, setBooted] = useState(false);
  const [sound, setSound] = useState(false);
  const [skillId, setSkillId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [devMode, setDevMode] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const toastId = useRef(0);

  const reducedMotion = useMemo(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  const sfx = useCallback((k: BlipKind = 'click') => blip(k), []);

  const toggleSound = useCallback(() => {
    setSound((s) => {
      const next = !s;
      setSoundEnabled(next);
      if (next) setTimeout(() => blip('unlock'), 60);
      return next;
    });
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    blip(m === 'recruiter' ? 'page' : 'portal');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const toast = useCallback((msg: string, tone: Toast['tone'] = 'sys') => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, msg, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const unlockDevMode = useCallback(() => {
    setDevMode((d) => {
      if (!d) {
        toast('DEVELOPER MODE ACTIVATED', 'power');
        blip('unlock');
        setTerminalOpen(true);
      }
      return true;
    });
  }, [toast]);

  const scrollTo = useCallback((target: string) => {
    const el = document.querySelector(target);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -20, duration: 1.8 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const openSkill = useCallback((id: string | null) => { setSkillId(id); if (id) blip('power'); }, []);
  const openProject = useCallback((id: string | null) => { setProjectId(id); if (id) blip('portal'); }, []);

  const value: AppState = {
    mode, setMode, booted, setBooted, sound, toggleSound, sfx,
    reducedMotion, isMobile, lenisRef, scrollTo,
    skillId, openSkill, projectId, openProject,
    terminalOpen, setTerminalOpen, mapOpen, setMapOpen,
    toasts, toast, devMode, unlockDevMode,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside provider');
  return v;
}
