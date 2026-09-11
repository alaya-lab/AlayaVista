'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Pause, Play, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
const citation = `@misc{tan2026alayavista,
  title  = {AlayaVista: Streaming World Modeling from
            Panoramic States to Perspective Video},
  author = {Jiaming Tan and Mingliang Zhai and Zhen Li and
            Yuwei Wu and Chuanhao Li and Kaipeng Zhang},
  year   = {2026},
  url    = {https://alaya-lab.github.io/AlayaVista}
}`;
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.play().catch(() => {});
  }, []);
  async function toggle() {
    if (!video.current) return;
    if (video.current.paused) { try { await video.current.play(); } catch { setFailed(true); } }
    else video.current.pause();
  }
  return <><video ref={video} className="hero-video" muted loop playsInline preload="none" poster="assets/hero-background.webp" aria-label="AlayaVista background video" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}><source src="assets/hero-background.mp4" type="video/mp4" /></video>{!failed && <Button className="hero-play" variant="outline" size="icon" aria-label={playing ? 'Pause background video' : 'Play background video'} onClick={toggle}>{playing ? <Pause size={16} /> : <Play size={16} />}</Button>}</>;
}
export function Citation() {
  const [status, setStatus] = useState('Copy BibTeX');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try { await navigator.clipboard.writeText(citation); setStatus('Copied'); }
    catch { setStatus('Select text to copy'); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setStatus('Copy BibTeX'), 3000);
  }
  return <div className="citation-box"><div className="citation-toolbar"><span>BIBTEX</span><Button variant="ghost" onClick={copy}>{status === 'Copied' ? <Check size={15} /> : <Copy size={15} />}<span aria-live="polite">{status}</span></Button></div><pre><code>{citation}</code></pre></div>;
}


const showcaseScenes = [
  { id: 2, name: 'Misty mountain trail', motion: 'Yaw rotation', description: 'Turn along a misty mountain trail. Follow the viewport across the panorama and compare the vegetation in the rendered and refined views.' },
  { id: 4, name: 'Flower meadow', motion: 'Yaw rotation', description: 'Sweep across an open meadow. Watch the selected field of view move through the panoramic seam and into the flower field.' },
  { id: 6, name: 'Tidal beach', motion: 'Yaw rotation', description: 'Rotate across a tidal beach. Compare the wet sand, shoreline, and headland from panoramic context to the final perspective.' },
];

export function Showcase() {
  const [selected, setSelected] = useState(showcaseScenes[0].id);
  const stage = useRef<HTMLDivElement>(null);
  const outgoing = useRef<HTMLCanvasElement>(null);
  const transition = useRef<Animation | null>(null);
  useEffect(() => () => transition.current?.cancel(), []);

  function changeScene(value: unknown) {
    const next = Number(value);
    if (next === selected) return;
    const player = stage.current?.querySelector('video');
    const canvas = outgoing.current;
    transition.current?.cancel();
    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Freeze the outgoing frame so it can fade without keeping another video playing.
      const context = canvas.getContext('2d');
      canvas.width = 2048;
      canvas.height = 1696;
      canvas.style.backgroundImage = `url(assets/showcase/comparison-${selected}.webp)`;
      if (player && player.readyState >= 2 && context) {
        try { context.drawImage(player, 0, 0, canvas.width, canvas.height); }
        catch { context.clearRect(0, 0, canvas.width, canvas.height); }
      }
      transition.current = canvas.animate([
        { opacity: 1, transform: 'translateX(0) scale(1)' },
        { opacity: 0, transform: 'translateX(-24px) scale(.985)' },
      ], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    player?.pause();
    setSelected(next);
  }

  return <Tabs orientation="vertical" value={selected} onValueChange={changeScene} className="showcase-browser">
    <TabsList className="showcase-list" aria-label="Choose a video scene">
      {showcaseScenes.map((scene, index) => <TabsTrigger key={scene.id} value={scene.id} className="showcase-option">
        <span className="showcase-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="showcase-option-body"><span className="showcase-name">{scene.name}</span><span className="showcase-description-reveal" aria-hidden={selected !== scene.id}><span className="showcase-description-clip"><span className="showcase-description">{scene.description}</span></span></span></span>
      </TabsTrigger>)}
    </TabsList>
    <div className="showcase-stage" ref={stage}>
      <canvas ref={outgoing} className="showcase-outgoing" aria-hidden="true" />
      {showcaseScenes.map(scene => <TabsContent key={scene.id} value={scene.id} className="showcase-panel">
        {selected === scene.id && <figure className="showcase-feature">
          <div className="video-wrap comparison-wrap"><video key={scene.id} controls playsInline muted preload="metadata" poster={`assets/showcase/comparison-${scene.id}.webp`} aria-label={`${scene.name}: synchronized panorama, rendered perspective, and refined output`}>
            <source src={`assets/showcase/comparison-${scene.id}.mp4`} type="video/mp4" />
            Your browser does not support embedded video. <a href={`assets/showcase/comparison-${scene.id}.mp4`}>Download this sample.</a>
          </video></div>
          <figcaption className="showcase-caption"><div><span className="showcase-caption-title">{scene.name}</span><span className="showcase-motion">{scene.motion} · ~30 sec</span></div><a href={`assets/showcase/comparison-${scene.id}.mp4`} download aria-label={`Download ${scene.name} comparison video`}>Download <ArrowUpRight size={15} /></a></figcaption>
          <p className="showcase-video-note">Panorama → Rendered → Refined · Frame-synchronized playback</p>
        </figure>}
      </TabsContent>)}
    </div>
  </Tabs>;
}
