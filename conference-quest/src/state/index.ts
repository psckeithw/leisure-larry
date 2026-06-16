import { saveData, loadData, removeData, STORAGE_KEY } from './storage';
import type { GameState, Quest, SavedGameState } from '../types';

const questDefaults: Record<string, Quest> = {
  badge: {
    id: 'badge',
    title: 'Lost and Found',
    description: 'Find your lost conference badge.',
    objectives: [{ id: 'talk-to-marlene', description: 'Talk to Marlene.', completed: false }, { id: 'retrieve-badge', description: 'Retrieve your badge.', completed: false }],
    completed: false,
  },
  vendor: {
    id: 'vendor',
    title: 'Demo Day',
    description: 'Help a vendor fix a broken demo.',
    objectives: [{ id: 'talk-to-vendor', description: 'Talk to Chip.', completed: false }, { id: 'get-usb', description: 'Get a USB for the demo.', completed: false }, { id: 'fix-demo', description: 'Fix the demo.', completed: false }],
    completed: false,
  },
  slides: {
    id: 'slides',
    title: 'Missing Slides',
    description: 'Recover the keynote slides.',
    objectives: [{ id: 'ask-derek', description: 'Ask Derek.', completed: false }, { id: 'meet-courier', description: 'Meet the courier.', completed: false }, { id: 'recover-data', description: 'Recover the data.', completed: false }],
    completed: false,
  },
  keycard: {
    id: 'keycard',
    title: 'VIP Access',
    description: 'Gain access to the VIP event.',
    objectives: [{ id: 'find-card', description: 'Find the VIP keycard.', completed: false }, { id: 'reach-rooftop', description: 'Reach the Rooftop Lounge.', completed: false }],
    completed: false,
  },
  keynote: {
    id: 'keynote',
    title: 'Main Event',
    description: 'Deliver the keynote speech.',
    objectives: [{ id: 'reach-stage', description: 'Reach the stage.', completed: false }, { id: 'give-talk', description: 'Give the talk.', completed: false }],
    completed: false,
  },
};

export const baseState: GameState = {
  currentScene: 'hotel-lobby',
  visitedScenes: ['hotel-lobby'],
  inventory: [],
  flags: {},
  reputation: 0,
  quests: questDefaults,
  dialogueIndex: {},
  playTime: 0,
  ending: undefined,
};

export class StateEngine {
  private _state: GameState;
  private _listeners: Set<(state: GameState) => void> = new Set();

  constructor() {
    const saved = loadSavedGame();
    this._state = saved ?? structuredClone(baseState);
  }

  get state() {
    return structuredClone(this._state);
  }

  subscribe(listener: (state: GameState) => void) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private emit() {
    this._listeners.forEach((listener) => listener(this.state));
  }

  private patch(patch: Partial<GameState>) {
    this._state = {
      ...this._state,
      ...patch,
      reputation: patch.reputation ?? this._state.reputation,
      quests: patch.quests ?? this._state.quests,
      inventory: patch.inventory ?? this._state.inventory,
      flags: patch.flags ?? this._state.flags,
      visitedScenes: patch.visitedScenes ?? this._state.visitedScenes,
      dialogueIndex: patch.dialogueIndex ?? this._state.dialogueIndex,
    };
    this.emit();
  }

  addReputation(amount: number) {
    this.patch({ reputation: Math.max(-100, Math.min(100, this._state.reputation + amount)) });
  }

  addItem(itemId: string) {
    if (!this._state.inventory.includes(itemId)) {
      this.patch({ inventory: [...this._state.inventory, itemId] });
    }
  }

  removeItem(itemId: string) {
    this.patch({ inventory: this._state.inventory.filter((item) => item !== itemId) });
  }

  setFlag(key: string, value: boolean) {
    this.patch({ flags: { ...this._state.flags, [key]: value } });
  }

  hasFlag(key: string) {
    return this._state.flags[key] ?? false;
  }

  setEnding(ending: string) {
    this.patch({ ending });
  }

  completeQuest(questId: string) {
    if (!this._state.quests[questId]) return;
    const updated = { ...this._state.quests[questId] };
    updated.objectives = updated.objectives.map((objective) => ({ ...objective, completed: true }));
    updated.completed = true;
    this.patch({ quests: { ...this._state.quests, [questId]: updated } });
  }

  markObjectiveComplete(questId: string, objectiveId: string) {
    if (!this._state.quests[questId]) return;
    const quest = { ...this._state.quests[questId] };
    quest.objectives = quest.objectives.map((objective) =>
      objective.id === objectiveId ? { ...objective, completed: true } : objective,
    );
    this.patch({ quests: { ...this._state.quests, [questId]: quest } });
  }

  changeScene(sceneId: string) {
    const visited = new Set(this._state.visitedScenes);
    visited.add(sceneId);
    this.patch({ currentScene: sceneId, visitedScenes: Array.from(visited) });
  }

  saveGame() {
    const saved: SavedGameState = {
      version: 1,
      timestamp: Date.now(),
      state: structuredClone(this._state),
    };
    saveData(STATE_KEY, JSON.stringify(saved));
  }

  loadGame() {
    const saved = loadSavedGame();
    if (saved) {
      this._state = saved;
      this.emit();
    }
  }

  resetGame() {
    removeData(STATE_KEY);
    this._state = structuredClone(baseState);
    this.emit();
    resolveReset?.();
  }
}

let resolveReset: (() => void) | undefined;
export const state = new StateEngine();

export function withReset<T extends (...args: any[]) => any>(fn: T) {
  return async (...args: any[]) => {
    if (resolveReset) resolveReset();
    return new Promise<void>((resolve) => {
      resolveReset = resolve;
      state.resetGame();
    });
  };
}
