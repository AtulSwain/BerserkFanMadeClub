import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './motion';

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  ember: boolean;
  phase: number;
}

/**
 * Drifting ash with the occasional ember, over a slow layer of fog.
 * One small canvas per scene; it pauses off-screen and stays still for
 * visitors who prefer reduced motion.
 */
export function Atmosphere({ density = 70, embers = 0.06, className = '' }: { density?: number; embers?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.4 + Math.random() * 1.8,
      vx: (Math.random() - 0.3) * 0.25,
      vy: -(0.12 + Math.random() * 0.45),
      a: 0.15 + Math.random() * 0.5,
      ember: Math.random() < embers,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((density * w * h) / (1440 * 900));
      motes = Array.from({ length: Math.max(12, n) }, () => spawn(true));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.ember ? `rgba(196, 64, 40, ${m.a})` : `rgba(214, 205, 188, ${m.a * 0.7})`;
        ctx.fill();
      }
    };

    const tick = (t: number) => {
      raf = 0;
      if (!visible) return;
      for (const m of motes) {
        m.x += m.vx + Math.sin(t / 2400 + m.phase) * 0.15;
        m.y += m.vy;
        if (m.y < -10 || m.x < -10 || m.x > w + 10) Object.assign(m, spawn(false));
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !still && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    if (!still) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density, embers]);

  return (
    <div className={`atmosphere ${className}`} aria-hidden="true">
      <div className="atmosphere__fog atmosphere__fog--a" />
      <div className="atmosphere__fog atmosphere__fog--b" />
      <canvas ref={canvasRef} className="atmosphere__ash" />
    </div>
  );
}
