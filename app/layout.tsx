import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AlayaVista — Streaming World Modeling',
  description: 'From panoramic states to perspective video. AlayaVista is a camera-controllable autoregressive (AR) world model that maintains 360° context and refines only the view you see.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}
