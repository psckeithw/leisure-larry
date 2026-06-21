import { useGameContext } from './GameContext';
import { DialogueUI } from './ui/DialogueUI';
import { ReactCanvasRenderer } from './engine/ReactCanvasRenderer';
import { dialogueEngine } from './engine/dialogue';

export function GameScreenInner() {
  const ctx = useGameContext();
  const { scene, npcsHere, navigate, interactHotspot, startDialogue, advanceDialogue, closeDialogue, inventory } = ctx;

  if (!scene) {
    return <div className="loading-screen">Loading...</div>;
  }

  const dialogueNode = ctx.dialogueActive && ctx.currentNodeId
    ? dialogueEngine.node(ctx.currentNodeId)
    : null;
  const dialogueNpc = dialogueNode
    ? npcsHere.find((n) => n.id === dialogueNode.speaker)
    : undefined;

  const handleHotspotClick = (hotspotId: string) => {
    const msg = interactHotspot({ id: hotspotId });
    if (msg) alert(msg);
  };

  const handleChoice = (choiceId: string) => {
    advanceDialogue(choiceId);
  };

  return (
    <main className="game-root" role="application">
      <div className="game-canvas">
        <ReactCanvasRenderer scene={scene} npcs={npcsHere as any} />
        <div className="scene-info">
          <h2>{scene.name}</h2>
          <p>{scene.description}</p>
        </div>
      </div>

      {ctx.dialogueActive && dialogueNode && (
        <DialogueUI
          node={dialogueNode}
          speakerName={dialogueNpc?.name}
          onChoice={handleChoice}
          onClose={closeDialogue}
        />
      )}

      <nav className="scene-nav">
        <button type="button" onClick={() => navigate('hotel-lobby')}>Lobby</button>
        <button type="button" onClick={() => navigate('registration-desk')}>Registration</button>
        <button type="button" onClick={() => navigate('expo-hall')}>Expo Hall</button>
        <button type="button" onClick={() => navigate('vendor-row')}>Vendor Row</button>
        <button type="button" onClick={() => navigate('casino-floor')}>Casino</button>
        <button type="button" onClick={() => navigate('server-room')}>Server Room</button>
        <button type="button" onClick={() => navigate('vip-event')}>VIP Event</button>
      </nav>

      <aside className="hotspots">
        <h3>Interact</h3>
        {scene.hotspots.map((hs) => (
          <div key={hs.id} className="hotspot-controls">
            <button type="button" onClick={() => handleHotspotClick(hs.id)}>
              {hs.label}
            </button>
          </div>
        ))}
      </aside>

      <aside className="npcs">
        <h3>People Here</h3>
        {npcsHere.map((npc) => (
          <button key={npc.id} type="button" onClick={() => startDialogue(npc.id)}>
            {npc.name}
          </button>
        ))}
      </aside>

      <aside className="inventory">
        <h3>Inventory</h3>
        <ul>
          {inventory.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
