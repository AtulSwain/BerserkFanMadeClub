import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Nav } from '@/components/Nav';
import { InkFilters } from '@/components/Page';
import Home from '@/pages/Home';
import { OpenArchiveContext } from '@/context/OpenArchive';
import { SlotToggle } from '@/components/SlotToggle';

// Every section is its own chunk — the cover loads alone.
const ArchiveIndex = lazy(() => import('@/pages/ArchiveIndex'));
const Origins = lazy(() => import('@/pages/Origins'));
const Characters = lazy(() => import('@/pages/Characters'));
const CharacterDossier = lazy(() => import('@/pages/CharacterDossier'));
const Relationships = lazy(() => import('@/pages/Relationships'));
const Entries = lazy(() => import('@/pages/Entries'));
const Apostles = lazy(() => import('@/pages/Apostles'));
const GodHand = lazy(() => import('@/pages/GodHand'));
const Weapons = lazy(() => import('@/pages/Weapons'));
const Chronology = lazy(() => import('@/pages/Chronology'));
const EventView = lazy(() => import('@/pages/EventView'));
const Lore = lazy(() => import('@/pages/Lore'));
const Atlas = lazy(() => import('@/pages/Atlas'));
const Craft = lazy(() => import('@/pages/Craft'));
const PanelLab = lazy(() => import('@/pages/PanelLab'));
const Cinematography = lazy(() => import('@/pages/Cinematography'));
const Anime = lazy(() => import('@/pages/Anime'));
const Compare = lazy(() => import('@/pages/Compare'));
const Music = lazy(() => import('@/pages/Music'));
const Volumes = lazy(() => import('@/pages/Volumes'));
const Search = lazy(() => import('@/pages/Search'));
const Production = lazy(() => import('@/pages/Production'));
const Sources = lazy(() => import('@/pages/Sources'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const SearchOverlay = lazy(() => import('@/components/SearchOverlay').then((m) => ({ default: m.SearchOverlay })));


function Loading() {
  return (
    <div className="loading" role="status">
      <span className="annot">turning the page…</span>
    </div>
  );
}

export default function App() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [splitKey, setSplitKey] = useState(0);

  const openArchive = useCallback(
    (to: string) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) setSplitKey((k) => k + 1);
      navigate(to);
    },
    [navigate],
  );

  useEffect(() => {
    if (!splitKey) return;
    const t = setTimeout(() => setSplitKey(0), 1100);
    return () => clearTimeout(t);
  }, [splitKey]);

  // New page: start at the top, unless jumping to an anchor.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        setTimeout(() => el.scrollIntoView({ block: 'start' }), 60);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <OpenArchiveContext.Provider value={openArchive}>
      <a href="#main" className="skip-link">Skip to content</a>
      <InkFilters />
      <Nav onSearch={() => setSearchOpen(true)} />
      <main id="main" key={pathname} className={pathname === '/' ? '' : 'route-enter'}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<ArchiveIndex />} />
            <Route path="/origins" element={<Origins />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/characters/:id" element={<CharacterDossier />} />
            <Route path="/relationships" element={<Relationships />} />
            <Route path="/factions" element={<Entries kind="faction" />} />
            <Route path="/creatures" element={<Entries kind="creature" />} />
            <Route path="/glossary" element={<Entries kind="glossary" />} />
            <Route path="/apostles" element={<Apostles />} />
            <Route path="/apostles/:id" element={<Apostles />} />
            <Route path="/god-hand" element={<GodHand />} />
            <Route path="/god-hand/:id" element={<GodHand />} />
            <Route path="/weapons" element={<Weapons />} />
            <Route path="/weapons/:id" element={<Weapons />} />
            <Route path="/chronology" element={<Chronology />} />
            <Route path="/events/:id" element={<EventView />} />
            <Route path="/lore" element={<Lore />} />
            <Route path="/lore/:id" element={<Lore />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/atlas/:id" element={<Atlas />} />
            <Route path="/craft" element={<Craft />} />
            <Route path="/panel-lab" element={<PanelLab />} />
            <Route path="/cinematography" element={<Cinematography />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/music" element={<Music />} />
            <Route path="/volumes" element={<Volumes />} />
            <Route path="/volumes/:id" element={<Volumes />} />
            <Route path="/search" element={<Search />} />
            <Route path="/production" element={<Production />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay open={searchOpen} onClose={closeSearch} />
        </Suspense>
      )}
      {import.meta.env.DEV && <SlotToggle />}
      {splitKey > 0 && (
        <div className="split" key={splitKey} aria-hidden="true">
          <div className="split__leaf split__leaf--l" />
          <div className="split__leaf split__leaf--r" />
          <div className="split__spine" />
        </div>
      )}
    </OpenArchiveContext.Provider>
  );
}
