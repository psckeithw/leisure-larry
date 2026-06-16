import { useGameContext } from './GameContext';
import { CanvasRenderer } from './engine/renderer';
import { DialogueUI } from './ui/DialogueUI';
import { NavigationBar } from './ui/components/NavigationBar';
import { InventoryUI } from './ui/components/InventoryUI';
import { QuestLogUI } from './ui/components/QuestLogUI';
import { SettingsUI } from './ui/components/SettingsUI';
import { SaveLoadUI } from './ui/components/SaveLoadUI';
import { SCENE_WIDTH, SCENE_HEIGHT } from './world/constants';
import { processHotspot } from './engine/hotspots';
import { useEffect, useRef, useState, useCallback } from 'react';

let renderer: CanvasRenderer | null = null;

export default function App() {
  const ctx = useGameContext();
  const [dialogue, setDialogue] = useState<{ npcId: string; node: any } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx.scene || !containerRef.current) return;
    if (renderer) {
      renderer.shutdown();
    }
    renderer = new CanvasRenderer(containerRef.current);
    renderer.mount({
      id: ctx.scene.id,
      name: ctx.scene.id,
      description: ctx.scene.description,
      background: '',
      width: ctx.sceneWidth,
      height: ctx.sceneHeight,
      hotspots: ctx.scene.hotspots,
      npcs: [],
    });
    return () => {
      renderer?.shutdown();
      renderer = null;
    };
  }, [ctx.scene, ctx.sceneWidth, ctx.sceneHeight]);

  const handleHotspot = useCallback(
    (hs: { id: string; action?: string; targetScene?: string; requiredItem?: string }) => {
      const msg = ctx.interactHotspot(hs);
      if (msg) ctx.resetGame();
    },
    [ctx],
  );

  const handleDialogue = useCallback(
    (npcId: string) => {
      ctx.startDialogue(npcId);
      const next = ctx.advanceDialogue('__start__');
      if (next) {
        setDialogue({
          npcId,
          node: {
            speaker: npcId.replace(/-/g, ' '),
            text: '...',
            choices: [],
          },
        });
      }
    },
    [ctx],
  );

  const advanceDialogue = useCallback(
    (choiceId: string) => {
      if (!dialogue) return;
      const next = ctx.advanceDialogue(choiceId);
      if (!next) {
        ctx.closeDialogue();
        setDialogue(null);
      }
    },
    [ctx, dialogue],
  );

  if (!ctx.scene) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="game-root">
      <div ref={containerRef} className="canvas-host" />
      <div className="ui-layer">
        <NavigationBar />
        <div className="scene-panel">
          <h2>{ctx.scene.name}</h2>
          <p>{ctx.scene.description}</p>
          <div className="hotspots">
            {ctx.scene.hotspots.map((hs) => (
              <button
                key={hs.id}
                type="button"
                className="hotspot-btn"
                onClick={() => handleHotspot(hs)}
              >
                {hs.label}
              </button>
            ))}
          </div>
          <div className="npcs">
            {ctx.npcsHere.map((npc) => (
              <button
                key={npc.id}
                type="button"
                className="npc-btn"
                style={{ borderColor: npc.color }}
                onClick={() => handleDialogue(npc.id)}
              >
                {npc.name}
              </button>
            ))}
          </div>
        </div>
        <InventoryUI />
        <QuestLogUI />
        <SettingsUI />
        <SaveLoadUI />
        <DialogueUI
          node={dialogue?.node ?? null}
          onChoice={advanceDialogue}
          onClose={() => {
            ctx.closeDialogue();
            setDialogue(null);
          }}
        />
      </div>
    </div>
  );
}
