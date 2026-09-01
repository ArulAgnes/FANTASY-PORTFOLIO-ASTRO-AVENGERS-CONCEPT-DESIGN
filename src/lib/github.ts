/* GitHub live discovery for github.com/ArulAgnes
   - public unauthenticated API, cached in localStorage (30 min)
   - graceful fallback to known resume repositories
   - never fabricates metadata: missing fields stay null/0  */

import { useEffect, useState } from 'react';

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  default_branch: string;
  visibility: string;
  archived: boolean;
  size: number;
}

export interface GhProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export type GhSource = 'loading' | 'live' | 'cache' | 'offline';

const USER = 'ArulAgnes';
const CACHE_KEY = 'agnesverse-gh-v1';
const PROFILE_KEY = 'agnesverse-gh-profile-v1';
const TTL = 30 * 60 * 1000;

/* Known resume repositories — used only when the API is unreachable.
   Counts are intentionally 0: we display nothing we can't verify. */
export const FALLBACK_REPOS: Repo[] = [
  { name: 'BookBazzar-PRO-Updated', description: 'Refurbished book selling & donation platform — PHP, MySQL, Bootstrap, PHP Mailer.', language: 'PHP', html_url: 'https://github.com/ArulAgnes/BookBazzar-PRO-Updated', homepage: null, stargazers_count: 0, forks_count: 0, updated_at: '', created_at: '', topics: [], default_branch: 'main', visibility: 'public', archived: false, size: 0 },
  { name: 'PHP-Astrology-Calculator-', description: 'Numerology & lucky number generator — PHP backend with JavaScript DOM interaction.', language: 'PHP', html_url: 'https://github.com/ArulAgnes/PHP-Astrology-Calculator-', homepage: null, stargazers_count: 0, forks_count: 0, updated_at: '', created_at: '', topics: [], default_branch: 'main', visibility: 'public', archived: false, size: 0 },
  { name: 'Pharmacy-Billing-Website', description: 'Pharmacy billing & inventory management — PHP, MySQL, FPDF invoices.', language: 'PHP', html_url: 'https://github.com/ArulAgnes/Pharmacy-Billing-Website', homepage: null, stargazers_count: 0, forks_count: 0, updated_at: '', created_at: '', topics: [], default_branch: 'main', visibility: 'public', archived: false, size: 0 },
  { name: 'MY-PORFOLIO-3D-ANIMATION', description: 'Previous 3D animated portfolio — Three.js, GSAP, ScrollTrigger, Lenis.', language: 'JavaScript', html_url: 'https://github.com/ArulAgnes/MY-PORFOLIO-3D-ANIMATION', homepage: null, stargazers_count: 0, forks_count: 0, updated_at: '', created_at: '', topics: [], default_branch: 'main', visibility: 'public', archived: false, size: 0 },
];

function readCache<T>(key: string): { data: T; ts: number } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as { data: T; ts: number };
  } catch { return null; }
}
function writeCache(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch { /* ignore */ }
}

async function ghFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

export function useGithubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [source, setSource] = useState<GhSource>('loading');

  useEffect(() => {
    let dead = false;
    const cached = readCache<Repo[]>(CACHE_KEY);
    if (cached && Date.now() - cached.ts < TTL) {
      setRepos(cached.data);
      setSource('cache');
      return;
    }
    ghFetch<Repo[]>(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)
      .then((data) => {
        if (dead) return;
        const clean = data.filter((r) => !r.archived).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        setRepos(clean);
        setSource('live');
        writeCache(CACHE_KEY, clean);
      })
      .catch(() => {
        if (dead) return;
        if (cached) { setRepos(cached.data); setSource('cache'); }
        else { setRepos(FALLBACK_REPOS); setSource('offline'); }
      });
    return () => { dead = true; };
  }, []);

  return { repos, source };
}

export function useGithubProfile() {
  const [profile, setProfile] = useState<GhProfile | null>(null);
  useEffect(() => {
    let dead = false;
    const cached = readCache<GhProfile>(PROFILE_KEY);
    if (cached && Date.now() - cached.ts < TTL) { setProfile(cached.data); return; }
    ghFetch<GhProfile>(`https://api.github.com/users/${USER}`)
      .then((p) => { if (!dead) { setProfile(p); writeCache(PROFILE_KEY, p); } })
      .catch(() => { if (!dead && cached) setProfile(cached.data); });
    return () => { dead = true; };
  }, []);
  return profile;
}

/* README — fetched on demand, sanitized minimally, errors are handled by UI */
export async function fetchReadme(repo: string, branch: string): Promise<string> {
  const branches = [branch, 'main', 'master'].filter((v, i, a) => v && a.indexOf(v) === i);
  const names = ['README.md', 'readme.md', 'README.MD', 'Readme.md'];
  for (const b of branches) {
    for (const n of names) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${USER}/${repo}/${b}/${n}`);
        if (res.ok) return await res.text();
      } catch { /* try next */ }
    }
  }
  throw new Error('README not found');
}

export function langHue(lang: string | null): string {
  switch ((lang || '').toLowerCase()) {
    case 'php': return '#8a6bff';
    case 'javascript': return '#ffe259';
    case 'typescript': return '#4fb3ff';
    case 'html': return '#ff7a1a';
    case 'css': return '#b19bff';
    case 'java': return '#ffb25e';
    case 'python': return '#69e2a0';
    case 'blade': return '#ff5648';
    case 'dockerfile': return '#4fb3ff';
    default: return '#9db2ce';
  }
}

export function timeAgo(iso: string): string {
  if (!iso) return '—';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  if (s < 31536000) return `${Math.floor(s / 2592000)}mo ago`;
  return `${Math.floor(s / 31536000)}y ago`;
}
