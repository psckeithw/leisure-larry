import { STORAGE_KEY, SCENE_ORDER } from './data';

interface SaveData {
  currentScene: string;
  visitedScenes: string[];
  inventory: string[];
  selectedItem: string | null;
  flags: Record<string, boolean | number | string>;
  playTime: number;
  quests: Record<string, any>;
  dialogueHistory: Record<string, string[]>;
  reputation: number;
  ending: string | null;
  settings: { textSpeed: number };
}

type Listener = (data: SaveData) => void;

export class GameStore {
  private state: SaveData;
  private listeners: Set<Listener> = new Set();

  constructor() {
    const saved = this.load();
    this.state = saved ?? {
      currentScene: 'hotel-lobby',
      visitedScenes: ['hotel-lobby'],
      inventory: [],
      selectedItem: null,
      flags: {},
      playTime: 0,
      quests: {},
      dialogueHistory: {},
      reputation: 0,
      ending: null,
      settings: { textSpeed: 30 },
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  public getState(): SaveData {
    return JSON.parse(JSON.stringify(this.state));
  }

  public update(partial: Partial<SaveData>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public addToInventory(itemId: string): void {
    if (!this.state.inventory.includes(itemId)) {
      this.state = {
        ...this.state,
        inventory: [...this.state.inventory, itemId],
      };
      this.notify();
    }
  }

  public removeFromInventory(itemId: string): void {
    this.state = {
      ...this.state,
      inventory: this.state.inventory.filter(id => id !== itemId),
    };
    this.notify();
  }

  public hasItem(itemId: string): boolean {
    return this.state.inventory.includes(itemId);
  }

  public selectItem(itemId: string | null): void {
    this.state = { ...this.state, selectedItem: itemId };
    this.notify();
  }

  public addFlag(key: string, value: string | number | boolean): void {
    this.state = {
      ...this.state,
      flags: { ...this.state.flags, [key]: value },
    };
    this.notify();
  }

  public hasFlag(key: string): boolean {
    return this.state.flags[key] === true;
  }

  public changeReputation(amount: number): void {
    this.state = {
      ...this.state,
      reputation: Math.max(-100, Math.min(100, this.state.reputation + amount)),
    };
    this.notify();
  }

  public unlockScene(sceneId: string, spawn?: string): void {
    const next = SCENE_ORDER[SCENE_ORDER.indexOf(sceneId) + 1];
    if (next && !this.state.visitedScenes.includes(next)) {
      this.state = {
        ...this.state,
        visitedScenes: [...this.state.visitedScenes, next],
      };
      this.notify();
    }
  }

  public updateQuestProgress(questId: string, objectiveIndex: number): void {
    const quest = { ...this.state.quests[questId] };
    if (!quest) return;

    const objectives = quest.objectives.map((obj, idx) =>
      idx === objectiveIndex ? { ...obj, completed: true } : obj
    );

    quest.objectives = objectives;
    quest.completed = objectives.every((obj) => obj.completed);

    this.state = {
      ...this.state,
      quests: { ...this.state.quests, [questId]: quest },
    };
    this.notify();
  }

  public save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  public load(): SaveData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public reset(): void {
    this.state = {
      currentScene: 'hotel-lobby',
      visitedScenes: ['hotel-lobby'],
      inventory: [],
      selectedItem: null,
      flags: {},
      playTime: 0,
      quests: {},
      dialogueHistory: {},
      reputation: 0,
      ending: null,
      settings: { textSpeed: 30 },
    };
    localStorage.removeItem(STORAGE_KEY);
    this.notify();
  }

  public get quests(): Record<string, any> {
    return this.state.quests;
  }
}

export const store = new GameStore();
