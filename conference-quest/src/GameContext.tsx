import { useEffect, useState, useContext, type ReactNode } from 'react';
import { createContext } from 'react';
import { useGameStore } from './store/gameStore';
import { mountGameEngine, createGameEngine } from './GameEngine';
import { triggerEnding } from './engine/systems/endingEngine';
import { questEngine } from './engine/systems/questEngine';
import { SCENE_WIDTH, SCENE_HEIGHT } from './world/constants';
import type { GameEnding, GameSettings, Scene, Npc } from './types/game';

export interface GameContextValue {
  state: ReturnType<typeof useGameStore.getState>;
  scene: Scene | null;
  npcsHere: Npc[];
  items: { id: string; name: string; description: string; icon: string; keyItem?: boolean }[];
  sceneWidth: number;
  sceneHeight: number;
  notification: string | null;
  navigate: (sceneId: string) => boolean;
  interactHotspot: (hotspot: { id: string; action?: string; targetScene?: string; requiredItem?: string }) => string | null;
  startDialogue: (npcId: string) => void;
  advanceDialogue: (choiceId: string) => string | null;
  closeDialogue: () => void;
  resetGame: () => void;
  settings: GameSettings;
  updateSettings: (s: Partial<GameSettings>) => void;
  triggerEnding: (ending: GameEnding) => void;
  dialogueActive: boolean;
  currentNodeId: string | null;
  dialogueNpc: string | null;
  inventory: string[];
  currentScene: string;
  visitedScenes: string[];
  reputation: number;
  flags: Record<string, boolean | number | string>;
  quests: Record<string, any>;
  ending: string | null;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}

export interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [engine, setEngine] = useState<ReturnType<typeof mountGameEngine> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    createGameEngine()
      .then((rawEngine) => {
        if (cancelled) return;
        setEngine(mountGameEngine(rawEngine));
        questEngine.init(useGameStore);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to create game engine:', err);
        if (!cancelled) {
          setError(err?.message || String(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="loading-screen" style={{ color: '#ff6b6b', flexDirection: 'column', gap: '16px' }}>
        <div>Engine Error:</div>
        <pre style={{ fontSize: '14px', maxWidth: '80vw', overflow: 'auto' }}>{error}</pre>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-screen">Loading DevConnect 2026...</div>;
  }

  if (!engine) {
    return <div className="loading-screen">Failed to load game engine.</div>;
  }

  const handleEnding = (ending: GameEnding) => {
    useGameStore.getState().triggerEnding(ending);
    triggerEnding(ending);
  };

  console.log('[GameContext] About to create Provider value...');
  const scene = engine.getScene();
  console.log('[GameContext] Got scene:', scene?.id || 'null');
  const npcsHere = engine.getNpcsHere(scene);
  console.log('[GameContext] Got npcs:', npcsHere?.length || 0);
  const state = useGameStore.getState();

  return (
    <GameContext.Provider
      value={{
        state: state,
        scene: scene,
        npcsHere: npcsHere,
        items: engine.items,
        sceneWidth: SCENE_WIDTH,
        sceneHeight: SCENE_HEIGHT,
        notification: null,
        settings: state.settings,
        updateSettings: (s) => state.updateSettings(s),
        navigate: engine.navigate,
        interactHotspot: engine.interactHotspot,
        startDialogue: engine.startDialogue,
        advanceDialogue: engine.advanceDialogue,
        closeDialogue: engine.closeDialogue,
        resetGame: engine.resetGame,
        triggerEnding: handleEnding,
        dialogueActive: state.dialogueActive,
        currentNodeId: state.currentNodeId,
        dialogueNpc: state.dialogueNpc,
        inventory: state.inventory,
        currentScene: state.currentScene,
        visitedScenes: state.visitedScenes,
        reputation: state.reputation,
        flags: state.flags,
        quests: state.quests,
        ending: state.ending,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
