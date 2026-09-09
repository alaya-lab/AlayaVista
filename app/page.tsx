/* oxlint-disable next/no-img-element -- Pre-optimized static images also run on GitHub Pages without an image server. */
import { RefinedGallery } from './refined-gallery';
import { ArrowDown, ArrowUpRight, FileText, Code2 } from 'lucide-react';
import { HeroVideo, Citation, Showcase } from './site-interactions';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

const metrics = [
  ['MoVerse', '0.4232', '0.5583', '0.8836', '0.5517', '1.0000', '13.17', '0.02746', '2.887'],
  ['HY-World 2.0', '0.4524', '0.5417', '0.8662', '0.5293', '0.9850', '13.54', '0.03885', '3.169'],
  ['AlayaVista', '0.4616', '0.5321', '0.9240', '0.5579', '0.9200', '14.10', '0.03312', '2.132'],
];
function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{n}</span>{children}</div>;
}
export default function Home() {
  return <>
    <a className="skip-link" href="#overview">Skip to content</a>
    <header className="header">
      <div className="header-brand"><img className="alaya-lab-logo" src="assets/alaya-lab-vertical-dark.svg" alt="Alaya Lab" width={48} height={48} /><span className="header-brand-divider" aria-hidden="true" /><a href="#home" className="wordmark" aria-label="AlayaVista home">Alaya<span>Vista</span><span className="brand-dot" /></a></div>
      <nav aria-label="Main navigation"><a href="#overview">Overview</a><a href="#showcase">Showcase</a><a href="#mugen">MUGEN</a></nav>
      <a className="header-paper" href="assets/AlayaVista.pdf" target="_blank" rel="noreferrer">Read the paper <ArrowUpRight size={15} /></a>
    </header>
    <main>
      <section id="home" className="hero">
        <HeroVideo />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span /> CAMERA-CONTROLLABLE WORLD MODEL</div>
          <h1>Alaya<span>Vista</span></h1>
          <p className="hero-subtitle">Streaming World Modeling<br />from Panoramic States to Perspective Video</p>
          <div className="hero-actions"><a className="action action-light" href="assets/AlayaVista.pdf" target="_blank" rel="noreferrer"><FileText size={17} /> Read the paper <ArrowUpRight size={16} /></a><a className="action action-glass" href="https://github.com/alaya-lab/AlayaVista" target="_blank" rel="noreferrer"><Code2 size={17} /> Code <ArrowUpRight size={16} /></a></div>
        </div>
        <div className="hero-bottom"><span>GLOBAL CONTEXT. SELECTIVE DETAIL.</span><a href="#overview">Explore the research <ArrowDown size={16} /></a><span>360° → YOUR VIEW</span></div>
      </section>
      <div className="authors content-width">
        <p>Jiaming Tan<sup>1,2,*</sup><span>·</span>Mingliang Zhai<sup>1,2</sup><span>·</span>Zhen Li<sup>1,3</sup><span>·</span>Yuwei Wu<sup>2,†</sup><span>·</span>Chuanhao Li<sup>1,†,‡</sup><span>·</span>Kaipeng Zhang<sup>1,†</sup></p>
        <div className="affiliations"><span><sup>1</sup> ALAYA LAB</span><span><sup>2</sup> BEIJING INSTITUTE OF TECHNOLOGY</span><span><sup>3</sup> UNIVERSITY OF TOKYO</span></div>
        <p className="author-notes">* Work done during internship at Alaya Lab &nbsp; † Corresponding author &nbsp; ‡ Project lead</p>
      </div>
      <section id="overview" className="section content-width">
        <Label n="01">THE IDEA</Label>
        <div className="split-heading"><h2>A world beyond<br />the <em>field of view.</em></h2><div><p className="lead">Keep the whole scene in context.<br />Bring the view you choose into focus.</p><p>AlayaVista separates panoramic world evolution from perspective observation synthesis. Starting from a single image, it maintains a camera-conditioned 360° latent state, renders the requested viewport, and refines that view into detailed video.</p></div></div>
        <div className="stats"><div><strong>360<span>°</span></strong><p>Panoramic scene context</p></div><div><strong>1 <span>image</span></strong><p>To initialize a world</p></div><div><strong>1024 <span>×</span> 576</strong><p>Perspective output resolution</p></div><div><strong>4 <span>steps</span></strong><p>Distilled perspective refinement</p></div></div>
        <figure className="paper-figure"><a href="assets/teaser.webp" target="_blank" rel="noreferrer" aria-label="Open panoramic state and perspective output figure"><img width={1389} height={488} src="assets/teaser.webp" alt="Panoramic state evolution at 0, 10, and 20 seconds, with queried perspective viewports and refined details." loading="lazy" /></a><figcaption><span>GLOBAL TO LOCAL</span> Panoramic states evolve over time. Only the queried perspective view is refined to display quality.</figcaption></figure>
      </section>
      <section id="method" className="section method-section">
        <div className="content-width"><Label n="02">THE METHOD</Label><div className="section-heading"><h2>Model the world.<br /><em>Refine the view.</em></h2><p>Global dynamics and local detail, connected entirely in latent space.</p></div>
          <div className="method-steps"><article><span>01 / INITIALIZE</span><h3>One image. All around.</h3><p>A pretrained panorama expansion model turns a perspective image into a complete 360° scene prior.</p></article><article><span>02 / EVOLVE</span><h3>A panoramic world state.</h3><p>Camera-conditioned panoramic latents evolve in autoregressive chunks, preserving full angular context.</p></article><article><span>03 / OBSERVE</span><h3>Detail where it matters.</h3><p>A latent renderer selects the viewport. Local refinement restores detail and doubles its spatial resolution.</p></article></div>
          <figure className="paper-figure"><a href="assets/method_pipeline.webp" target="_blank" rel="noreferrer" aria-label="Open the AlayaVista architecture diagram"><img width={1342} height={776} src="assets/method_pipeline.webp" alt="AlayaVista pipeline: perspective input, panorama initialization, camera-conditioned panoramic state generator, latent viewport renderer, perspective video refiner, and VAE decoder." loading="lazy" /></a><figcaption><span>ARCHITECTURE</span> Panorama initialization → state evolution → latent viewport rendering → perspective refinement.</figcaption></figure>
        </div>
      </section>
      <section id="showcase" className="section content-width">
        <Label n="03">SHOWCASE</Label><div className="section-heading"><h2>From panorama<br /><em>to your perspective.</em></h2><p>Panorama → Rendered → Refined, at matched timestamps.<br />The red outline follows the requested field of view.</p></div>
        <Showcase />
      </section>
      <RefinedGallery />
      <section id="mugen" className="section dataset-section"><div className="content-width"><Label n="04">THE DATASET</Label><div className="dataset-heading"><div><div className="dataset-title">MUGEN<span>無限</span></div><h2>A wider world<br />to <em>learn from.</em></h2></div><div><p className="lead">Real-world panoramic video.<br />Built for interactive world modeling.</p><p>Minute-long clips pair diverse environments and camera motion with captions, semantic attributes, camera trajectories, depth maps, and instance masks. AlayaVista is trained on MUGEN and the panoramic subset of Sekai2.</p></div></div><div className="stats dataset-stats"><div><strong>1,318</strong><p>Hours of panoramic video</p></div><div><strong>4K<span>+</span></strong><p>Video resolution</p></div><div><strong>60<span>s</span></strong><p>Standardized clip duration</p></div><div><strong>300<span>h</span></strong><p>Curated MUGEN-HQ subset</p></div></div><figure className="paper-figure"><a href="assets/statistic.webp" target="_blank" rel="noreferrer" aria-label="Open MUGEN dataset statistics"><img width={1731} height={930} src="assets/statistic.webp" alt="MUGEN dataset statistics and distributions of scenes, visual characteristics, and camera motion." loading="lazy" /></a><figcaption><span>MUGEN</span> Diverse semantic content and camera motion support panoramic world modeling.</figcaption></figure></div></section>
      <section id="results" className="section content-width"><Label n="05">EVALUATION</Label><div className="section-heading"><h2>A closer look at <em>quality.</em></h2><p>200 MUGEN-HQ evaluation cases.<br />All metrics measure final perspective videos.</p></div><div className="results-table"><Table><TableHeader><TableRow>{['Method', 'SSIM ↑', 'LPIPS ↓', 'Consistency ↑', 'Quality ↑', 'Dynamic ↑', 'PSNR ↑', 'TransErr ↓', 'RotErr ↓'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{metrics.map((row, index) => <TableRow className={index === 2 ? 'ours' : ''} key={row[0]}>{row.map((cell, i) => <TableCell key={i}>{cell}{index === 2 && i === 0 && <span className="ours-label">OURS</span>}</TableCell>)}</TableRow>)}</TableBody></Table></div><p className="table-note">Values from Table 1 of the paper. ↑ Higher is better. ↓ Lower is better. Metrics capture different aspects of quality and camera following.</p></section>
      <section id="citation" className="section citation-section content-width"><Label n="06">CITATION</Label><div className="section-heading"><h2>Build on <em>AlayaVista.</em></h2><a className="text-link" href="assets/AlayaVista.pdf" target="_blank" rel="noreferrer">Read the full paper <ArrowUpRight size={17} /></a></div><Citation /></section>
    </main>
    <footer className="footer content-width"><div><a className="wordmark" href="#home">Alaya<span>Vista</span><span className="brand-dot" /></a><p>From panoramic states to perspective video.</p></div><div className="footer-contact"><span>CONTACT</span><a href="mailto:chuanhao.li@shanda.com">chuanhao.li@shanda.com <ArrowUpRight size={14} /></a><a href="mailto:kaipeng.zhang@shanda.com">kaipeng.zhang@shanda.com <ArrowUpRight size={14} /></a></div><div className="footer-bottom"><span>Alaya Lab · 2026</span><a href="https://evoke-world.github.io/Evoke/" target="_blank" rel="noreferrer">Design inspired by Evoke <ArrowUpRight size={13} /></a><a href="#home">Back to top ↑</a></div></footer>
  </>;
}
