import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUp } from 'lucide-react';
import { AppProvider, useApp } from './hooks/app';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import Navbar, { WorldMap, Toasts } from './components/Navbar';
import Terminal from './components/Terminal';
import Hero from './components/Hero';
import Origin from './components/Origin';
import PowerArmory from './components/PowerArmory';
import PowerDetail from './components/PowerDetail';
import MissionLogs from './components/MissionLogs';
import Projects from './components/Projects';
import LegacyBug from './components/LegacyBug';
import ProjectModal from './components/ProjectModal';
import CodeVault from './components/CodeVault';
import KnowledgeArchive from './components/KnowledgeArchive';
import CredentialVault from './components/CredentialVault';
import ContactPortal from './components/ContactPortal';
import Finale from './components/Finale';
import RecruiterMode from './components/RecruiterMode';
import { SideLabel, ScrollProgress } from './components/ui';
import { SITE } from './data/resume';

gsap.registerPlugin(ScrollTrigger);

function Shell() {
  const { mode, booted, lenisRef, setTerminalOpen, terminalOpen, mapOpen, setMapOpen, scrollTo, devMode, skillId, projectId } = useApp();

  /* Lenis smooth scroll <-> GSAP */
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true, touchMultiplier: 1.5 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lenisRef]);

  /* hold scroll until booted */
  useEffect(() => {
    const l = lenisRef.current;
    if (!l) return;
    if (booted) {
      l.start();
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
      return () => window.clearTimeout(t);
    }
    l.stop();
  }, [booted, lenisRef]);

  /* lock page scroll while a chamber / briefing / map is open */
  useEffect(() => {
    const l = lenisRef.current;
    if (!l) return;
    const locked = Boolean(skillId || projectId || mapOpen) || !booted;
    if (locked) l.stop(); else l.start();
  }, [skillId, projectId, mapOpen, booted, lenisRef]);

  /* global keys: ` terminal · esc map */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement;
      if (e.key === '`' && !typing) { e.preventDefault(); setTerminalOpen(!terminalOpen); }
      if (e.key === 'Escape' && mapOpen) setMapOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [terminalOpen, mapOpen, setTerminalOpen, setMapOpen]);

  if (mode === 'recruiter') return <RecruiterMode />;

  return (
    <div className="grain vignette relative bg-void text-white">
      <a href="#origin" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-ember focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-void">
        SKIP TO CONTENT
      </a>

      {!booted && <Preloader />}
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <SideLabel side="left">AGNESVERSE — ORBITAL RECORD 2026</SideLabel>
      <SideLabel side="right">{devMode ? 'DEVELOPER MODE — ACTIVE' : 'SCROLL IS THE CAMERA'}</SideLabel>

      <main>
        <Hero />
        <Origin />
        <PowerArmory />
        <MissionLogs />
        <Projects />
        <LegacyBug />
        <CodeVault />
        <KnowledgeArchive />
        <CredentialVault />
        <ContactPortal />
        <Finale />
      </main>

      {/* footer strip */}
      <footer className="relative border-t border-white/10 bg-black/60 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-mono text-[.52rem] tracking-[.26em] text-mist/50">
          <span>© 2026 {SITE.name} — THE AGNESVERSE</span>
          <span className="hidden md:inline">REACT · THREE.JS · GSAP · LENIS · DATA VIA GITHUB API</span>
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2 text-mist/70 transition-colors hover:text-ember" data-cursor="link" aria-label="Back to top">
            RE-ENTER <ArrowUp size={12} />
          </button>
        </div>
      </footer>

      {/* overlays */}
      <PowerDetail />
      <ProjectModal />
      <WorldMap />
      <Terminal />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
