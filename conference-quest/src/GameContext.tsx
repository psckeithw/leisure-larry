import { useEffect, useState, useMemo, useContext, type ReactNode, type ReactElement } from 'react';
import { createContext } from 'react';
import { useGameStore } from './store/gameStore';
import { mountGameEngine, createGameEngine } from './GameEngine';
import { triggerEnding } from './engine/systems/endingEngine';
import { SCENE_WIDTH, SCENE_HEIGHT } from './world/constants';
import type { GameEnding, GameSettings } from './types/game';

export interface GameContextValue {
  state: ReturnType<typeof useGameStore.getState>;
  scene: { id: string; name: string; description: string; hotspots: { id: string; x: number; y: number; width: number; height: number; label: string; targetScene?: string; requiredItem?: string; action?: string; lockedMessage?: string }[]; npcs: string[] } | null;
  npcsHere: { id: string; name: string; subtitle: string; color: string; position: { x: number; y: number } }[];
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
  const _currentScene = useGameStore((s) => s.currentScene);

  useEffect(() => {
    let cancelled = false;
    createGameEngine().then((rawEngine) => {
      if (cancelled) return;
      setEngine(mountGameEngine(rawEngine));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <GameContext.Provider
      value={{
        state: useGameStore.getState(),
        scene: engine.getScene(),
        npcsHere: engine.getNpcsHere(engine.getScene()),
        items: engine.items,
        sceneWidth: SCENE_WIDTH,
        sceneHeight: SCENE_HEIGHT,
        notification: null,
        settings: useGameStore.getState().settings,
        updateSettings: (s) => useGameStore.getState().updateSettings(s),
        navigate: engine.navigate,
        interactHotspot: engine.interactHotspot,
        startDialogue: engine.startDialogue,
        advanceDialogue: engine.advanceDialogue,
        closeDialogue: engine.closeDialogue,
        resetGame: engine.resetGame,
        triggerEnding: handleEnding,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
