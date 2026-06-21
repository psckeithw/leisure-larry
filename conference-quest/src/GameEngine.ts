import type { DialogueTree, Hotspot } from './types';
import { loadGameData, loadDialogues } from './data/loader';
import { SCENE_WIDTH, SCENE_HEIGHT } from './world/constants';
import { useGameStore } from './store/gameStore';
import { navigation } from './engine/navigation';
import { processHotspot } from './engine/hotspots';
import { loadDialogueTree, dialogueEngine } from './engine/dialogue';
import { triggerEnding } from './engine/systems/endingEngine';

export interface EngineScene {
  id: string;
  name: string;
  description: string;
  background: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  npcs: string[];
}

export interface EngineNpc {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  scene: string;
  position: { x: number; y: number };
  sprite: string;
  dialogueTree?: DialogueTree;
}

export interface EngineItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  keyItem?: boolean;
}

export interface GameEngineData {
  items: EngineItem[];
  scenes: Map<string, EngineScene>;
  npcs: Map<string, EngineNpc>;
  sceneWidth: number;
  sceneHeight: number;
  getScene: () => EngineScene | null;
  getNpcsHere: (scene: EngineScene | null) => EngineNpc[];
  navigate: (sceneId: string) => boolean;
  interactHotspot: (hotspot: { id: string; action?: string; targetScene?: string; requiredItem?: string }) => string | null;
  startDialogue: (npcId: string) => void;
  advanceDialogue: (choiceId: string) => string | null;
  closeDialogue: () => void;
  resetGame: () => void;
  triggerEnding: (ending: string) => void;
}

export async function createGameEngine(): Promise<GameEngineData> {
  console.log('[GameEngine] Starting createGameEngine...');
  
  console.log('[GameEngine] Loading game data...');
  const { items, scenes, npcs } = await loadGameData();
  console.log('[GameEngine] Game data loaded:', { items: items.length, scenes: scenes.length, npcs: npcs.length });
  
  console.log('[GameEngine] Loading dialogues...');
  const dialogueTrees = await loadDialogues();
  console.log('[GameEngine] Dialogues loaded:', { count: dialogueTrees.length });

  const sceneMap = new Map<string, EngineScene>();
  for (const scene of scenes) {
    sceneMap.set(scene.id, {
      id: scene.id,
      name: scene.name,
      description: scene.description,
      background: scene.background,
      width: scene.width,
      height: scene.height,
      hotspots: scene.hotspots,
      npcs: scene.npcs,
    });
  }

  const npcMap = new Map<string, EngineNpc>();
  for (const npc of npcs) {
    const tree = dialogueTrees.find((d) => d.npcId === npc.id);
    npcMap.set(npc.id, {
      id: npc.id,
      name: npc.name,
      subtitle: npc.subtitle ?? '',
      color: npc.color,
      scene: npc.scene,
      position: npc.position,
      sprite: npc.sprite,
      dialogueTree: tree,
    });
  }

  return {
    items,
    scenes: sceneMap,
    npcs: npcMap,
    sceneWidth: SCENE_WIDTH,
    sceneHeight: SCENE_HEIGHT,
    getScene: () => {
      const currentId = useGameStore.getState().currentScene;
      return sceneMap.get(currentId) ?? null;
    },
    getNpcsHere: (scene) => {
      if (!scene) return [];
      return scene.npcs.map((id) => npcMap.get(id)).filter((n): n is EngineNpc => !!n);
    },
    navigate: (sceneId: string) => {
      const ok = navigation.moveTo(sceneId);
      if (ok) useGameStore.getState().markSceneVisited(sceneId);
      return ok;
    },
    interactHotspot: (hotspot) => {
      const scene = sceneMap.get(useGameStore.getState().currentScene);
      if (!scene) return null;
      const hs = scene.hotspots.find((h) => h.id === hotspot.id);
      if (!hs) return null;

      if (hs.targetScene) {
        if (hs.requiredItem && !useGameStore.getState().inventory.includes(hs.requiredItem)) {
          return hs.lockedMessage ?? 'Locked.';
        }
        navigation.moveTo(hs.targetScene);
        return null;
      }

      if (hs.action) {
        const result = processHotspot(hs, useGameStore.getState() as any);
        if (result) return result.message;
      }
      return null;
    },
    startDialogue: (npcId: string) => {
      const tree = npcMap.get(npcId)?.dialogueTree;
      if (!tree) return;
      loadDialogueTree(tree);
      const first = dialogueEngine.start();
      useGameStore.setState({ dialogueActive: true, dialogueNpc: npcId, currentNodeId: first });
    },
    advanceDialogue: (choiceId: string) => {
      const { currentNodeId, dialogueNpc } = useGameStore.getState();
      if (!currentNodeId || !dialogueNpc) return null;
      const nextId = dialogueEngine.select(currentNodeId, choiceId);
      if (nextId === 'end' || !nextId) {
        useGameStore.setState({ dialogueActive: false, currentNodeId: null, dialogueNpc: null });
        return null;
      }
      useGameStore.setState({ currentNodeId: nextId });
      return nextId;
    },
    closeDialogue: () => {
      useGameStore.setState({ dialogueActive: false, currentNodeId: null, dialogueNpc: null });
    },
    resetGame: () => useGameStore.getState().resetGame(),
    triggerEnding: (ending: string) => triggerEnding(ending as any),
  };
}

export function mountGameEngine(engine: GameEngineData) {
  return engine;
}
