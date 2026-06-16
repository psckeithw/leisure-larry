import Phaser from 'phaser';
import type { GameState, SceneId, DEFAULT_SETTINGS } from '../types/game';

type GameEventHandler = (event: string, data?: unknown) => void;

class GameStateManager {
  private state: GameState | null = null;
  private listeners = new Set<GameEventHandler>();
  private saveKey = 'conference-quest-save';

  createNewGame(): GameState {
    const loadedItems = [] as string[];
    const state: GameState = {
      currentScene: 'hotel-lobby',
      visitedScenes: ['hotel-lobby'],
      inventory: loadedItems,
      selectedItem: null,
      reputation: 0,
      quests: {},
      dialogueHistory: {},
      flags: {},
      playTime: 0,
      ending: null,
      settings: { ...DEFAULT_SETTING S },
    };
    this.state = state;
    this.emit('state-changed', state);
    return state;
  }

  getState(): GameState | null {
    return this.state;
  }

  updateState(partial: Partial<GameState>): void {
    if (!this.state) return;
    this.state = { ...this.state, ...partial };
    this.emit('state-changed', this.state);
  }

  addItem(itemId: string): void {
    if (!this.state) return;
    if (!this.state.inventory.includes(itemId)) {
      this.state.inventory.push(itemId);
      this.emit('inventory-changed', this.state.inventory);
    }
  }

  removeItem(itemId: string): void {
    if (!this.state) return;
    this.state.inventory = this.state.inventory.filter(i => i !== itemId);
    this.emit('inventory-changed', this.state.inventory);
  }

  setFlag(key: string, value: boolean | number | string): void {
    if (!this.state) return;
    this.state.flags[key] = value;
  }

  getFlag(key: string): boolean | number | string | undefined {
    return this.state?.flags[key];
  }

  hasItem(itemId: string): boolean {
    return this.state?.inventory.includes(itemId) ?? false;
  }

  setReputation(amount: number): void {
    this.updateState({ reputation: (this.state?.reputation ?? 0) + amount });
  }

  startQuest(questId: string): void {
    if (!this.state) return;
    const quests = { ...this.state.quests, [questId]: { id: questId, title: '', description: '', objectives: [], completed: false } };
    this.updateState({ quests });
    this.emit('quest-started', questId);
  }

  completeQuest(questId: string): void {
    if (!this.state) return;
    const quest = this.state.quests[questId];
    if (!quest) return;
    const updated = { ...quest, completed: true, objectives: quest.objectives.map(o => ({ ...o, completed: true })) };
    const quests = { ...this.state.quests, [questId]: updated };
    this.updateState({ quests });
    this.emit('quest-completed', questId);
  }

  updateQuestObjective(questId: string, objectiveId: string, completed: boolean): void {
    if (!this.state) return;
    const quest = this.state.quests[questId];
    if (!quest) return;
    const objectives = quest.objectives.map(o => o.id === objectiveId ? { ...o, completed } : o);
    const updated = { ...quest, objectives };
    const quests = { ...this.state.quests, [questId]: updated };
    this.updateState({ quests });
  }

  saveGame(): boolean {
    if (!this.state) return false;
    try {
      localStorage.setItem(this.saveKey, JSON.stringify(this.state));
      return true;
    } catch {
      return false;
    }
  }

  loadGame(): GameState | null {
    try {
      const raw = localStorage.getItem(this.saveKey);
      if (!raw) return null;
      const state = JSON.parse(raw) as GameState;
      this.state = state;
      this.emit('state-changed', state);
      return state;
    } catch {
      return null;
    }
  }

  hasSave(): boolean {
    return localStorage.getItem(this.saveKey) !== null;
  }

  deleteSave(): void {
    localStorage.removeItem(this.saveKey);
  }

  onChange(handler: GameEventHandler): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  private emit(event: string, data?: unknown): void {
    this.listeners.forEach(fn => fn(event, data));
  }
}

export const gameState = new GameStateManager();
