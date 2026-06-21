import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameSettings, GameEnding } from '../types/game';
import { DEFAULT_SETTINGS, ENDING_TITLES } from '../types/game';

export interface GameStore extends GameState {
  currentScene: string;
  inventory: string[];
  selectedItem: string | null;
  reputation: number;
  quests: Record<string, QuestState>;
  flags: Record<string, boolean | number | string>;
  dialogueHistory: Record<string, string[]>;
  playTime: number;
  ending: string | null;
  settings: GameSettings;
  dialogueActive: boolean;
  dialogueNpc: string | null;
  currentNodeId: string | null;

  setCurrentScene: (sceneId: string) => void;
  markSceneVisited: (sceneId: string) => void;
  addToInventory: (itemId: string) => void;
  removeFromInventory: (itemId: string) => void;
  selectInventoryItem: (itemId: string | null) => void;
  setReputation: (amount: number) => void;
  updateQuestObjective: (questId: string, objectiveId: string, completed: boolean) => void;
  setFlag: (key: string, value: boolean | number | string) => void;
  getFlag: (key: string) => boolean | number | string | undefined;
  completeQuest: (questId: string) => void;
  startQuest: (questId: string) => void;
  advanceDialogue: (npcId: string, nodeId: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  triggerEnding: (ending: GameEnding) => void;
  resetGame: () => void;
  incrementPlayTime: (delta: number) => void;
}

export interface QuestState {
  id: string;
  title: string;
  description: string;
  objectives: { id: string; description: string; completed: boolean }[];
  completed: boolean;
  rewardItems?: string[];
  rewardReputation?: number;
}

const questInitialState: Record<string, QuestState> = {};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentScene: 'hotel-lobby',
      visitedScenes: ['hotel-lobby'],
      inventory: [],
      selectedItem: null,
      reputation: 0,
      quests: questInitialState,
      flags: {},
      dialogueHistory: {},
      playTime: 0,
      ending: null,
      dialogueActive: false,
      dialogueNpc: null,
      currentNodeId: null,
      settings: DEFAULT_SETTINGS,

      setCurrentScene: (sceneId: string) => {
        const current = get();
        const visited = current.visitedScenes.includes(sceneId)
          ? current.visitedScenes
          : [...current.visitedScenes, sceneId];
        set({ currentScene: sceneId, visitedScenes: visited });
      },

      markSceneVisited: (sceneId: string) => {
        const current = get();
        if (!current.visitedScenes.includes(sceneId)) {
          set({ visitedScenes: [...current.visitedScenes, sceneId] });
        }
      },

      addToInventory: (itemId: string) => {
        const current = get();
        if (current.inventory.includes(itemId)) return;
        set({ inventory: [...current.inventory, itemId] });
      },

      removeFromInventory: (itemId: string) => {
        const current = get();
        set({ inventory: current.inventory.filter(id => id !== itemId) });
      },

      selectInventoryItem: (itemId: string | null) => set({ selectedItem: itemId }),

      setReputation: (amount: number) => {
        const current = get();
        set({ reputation: current.reputation + amount });
      },

      updateQuestObjective: (questId: string, objectiveId: string, completed: boolean) => {
        const current = get();
        const quest = current.quests[questId];
        if (!quest) return;
        const objectives = quest.objectives.map(obj =>
          obj.id === objectiveId ? { ...obj, completed } : obj
        );
        const updated = { ...quest, objectives };
        set({
          quests: { ...current.quests, [questId]: updated },
        });
      },

      setFlag: (key: string, value: boolean | number | string) => {
        const current = get();
        set({ flags: { ...current.flags, [key]: value } });
      },

      getFlag: (key: string) => get().flags[key],

      completeQuest: (questId: string) => {
        const current = get();
        const quest = current.quests[questId];
        if (!quest) return;
        const objectives = quest.objectives.map(obj => ({ ...obj, completed: true }));
        const updated = { ...quest, objectives, completed: true };
        set({
          quests: { ...current.quests, [questId]: updated },
          reputation: current.reputation + (updated.rewardReputation ?? 0),
        });
      },

      startQuest: (questId: string) => {
        const current = get();
        if (current.quests[questId]) return;
        set({
          quests: {
            ...current.quests,
            [questId]: {
              id: questId,
              title: questId,
              description: questId,
              objectives: [],
              completed: false,
            },
          },
        });
      },

      advanceDialogue: (npcId: string, nodeId: string) => {
        const current = get();
        const history = current.dialogueHistory[npcId] ?? [];
        set({
          dialogueHistory: {
            ...current.dialogueHistory,
            [npcId]: [...history, nodeId],
          },
        });
      },

      updateSettings: (newSettings: Partial<GameSettings>) => {
        const current = get();
        set({ settings: { ...current.settings, ...newSettings } });
      },

      triggerEnding: (ending: GameEnding) => {
        set({ ending });
      },

      resetGame: () => {
        set({
          currentScene: 'hotel-lobby',
          visitedScenes: ['hotel-lobby'],
          inventory: [],
          selectedItem: null,
          reputation: 0,
          quests: questInitialState,
          flags: {},
          dialogueHistory: {},
          playTime: 0,
        ending: null,
        dialogueActive: false,
        dialogueNpc: null,
        currentNodeId: null,
      });
      },

      incrementPlayTime: (delta: number) => {
        const current = get();
        set({ playTime: current.playTime + delta });
      },
    }),
    {
      name: 'conference-quest-save',
      partialize: (state: GameStore) => ({
        currentScene: state.currentScene,
        visitedScenes: state.visitedScenes,
        inventory: state.inventory,
        selectedItem: state.selectedItem,
        reputation: state.reputation,
        quests: state.quests,
        flags: state.flags,
        dialogueHistory: state.dialogueHistory,
        playTime: state.playTime,
        ending: state.ending,
        dialogueActive: state.dialogueActive,
        dialogueNpc: state.dialogueNpc,
        currentNodeId: state.currentNodeId,
        settings: state.settings,
      }),
    }
  )
);

export function useSelectInventory() {
  return useGameStore(state => state.inventory);
}

export function useSelectScene() {
  return useGameStore(state => state.currentScene);
}

export function useSelectReputation() {
  return useGameStore(state => state.reputation);
}

export function useSelectEnding() {
  return useGameStore(state => state.ending);
}

export function useSelectSettings() {
  return useGameStore(state => state.settings);
}
