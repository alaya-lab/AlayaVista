'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import samples from './refined-samples.json';

type Sample = (typeof samples)[number];

function Preview({ sample, paused }: { sample: Sample; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const inView = useRef(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    inView.current = false;
    const update = () => {
      if (inView.current && !paused && !motion.matches && !document.hidden) {
        setLoaded(true);
        video.play().catch(() => {});
      } else video.pause();
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      update();
    }, { threshold: .05 });
    observer.observe(video);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    return () => { observer.disconnect(); video.pause(); document.removeEventListener('visibilitychange', update); motion.removeEventListener('change', update); };
  }, [paused]);
  useEffect(() => {
    const video = ref.current;
    if (loaded && video && inView.current && !document.hidden && !paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {});
  }, [loaded, paused]);
  return <video ref={ref} src={loaded ? sample.src : undefined} poster={sample.poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

export function RefinedGallery() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<Sample | null>(null);
  const rowCount = Math.min(3, samples.length);
  const rows = Array.from({ length: rowCount }, (_, index) => samples.slice(Math.floor(index * samples.length / rowCount), Math.floor((index + 1) * samples.length / rowCount)));
  return <section id="more-results" className="refined-gallery" aria-label="More refined video results">
    <div className="content-width">
      <div className="section-label"><span>03</span> MORE RESULTS</div>
      <div className="section-heading"><h2>More scenes.<br /><em>More perspectives.</em></h2><p>Explore {samples.length} refined video outputs.<br />Select a scene to watch the full sequence.</p></div>
      <div className="gallery-toolbar"><div><span>REFINED OUTPUTS</span><p>Camera-controlled scenes, brought into detail.</p></div><Button variant="outline" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? 'Resume gallery motion' : 'Pause gallery motion'}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Resume motion' : 'Pause motion'}</Button></div>
    </div>
    <div className="gallery-rows" data-paused={paused || active !== null}>
      {rows.map((row, index) => <div key={index} className="gallery-row" aria-label={`Video row ${index + 1}`}>
        <div className={`gallery-track gallery-track-${index}`}>
          {[0, 1].map(copy => <div className={`gallery-group ${copy ? 'gallery-group-copy' : ''}`} key={copy}>
            {row.map(sample => <Button variant="ghost" key={sample.id} className="gallery-card" tabIndex={copy ? -1 : 0} onClick={() => setActive(sample)} aria-label={`Play ${sample.name}, ${sample.motion}`}>
              <Preview sample={sample} paused={paused || active !== null} />
              <span className="gallery-card-caption"><span>{sample.name}</span><Maximize2 size={16} /></span>
            </Button>)}
          </div>)}
        </div>
      </div>)}
    </div>
    <Dialog open={active !== null} onOpenChange={open => { if (!open) setActive(null); }}>
      <DialogContent className="gallery-dialog">
        <DialogTitle>{active?.name ?? 'Refined video'}</DialogTitle>
        <DialogDescription>{active?.motion} · Refined output · Full sequence</DialogDescription>
        {active && <video key={active.id} src={active.src} poster={active.poster} controls autoPlay muted playsInline aria-label={`${active.name} refined video`} />}
      </DialogContent>
    </Dialog>
  </section>;
}
