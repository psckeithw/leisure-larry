import { useEffect, useRef } from 'react';
import { CanvasRenderer } from './renderer';
import type { Scene, Npc } from '../types';

export function ReactCanvasRenderer({ scene, npcs }: { scene: Scene; npcs: Npc[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const r = new CanvasRenderer(containerRef.current);
    rendererRef.current = r;
    r.mount(scene, npcs as any);
    return () => {
      r.shutdown();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    if (r.current?.id !== scene.id) {
      r.mount(scene, npcs as any);
    }
  }, [scene, npcs]);

  return <div ref={containerRef} className="canvas-container" />;
}
