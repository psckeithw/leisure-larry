export interface Item {
  id: string;
  name: string;
  description: string;
  keyItem?: boolean;
}

export interface QuestState {
  id: string;
  title: string;
  description: string;
  objectives: { id: string; description: string; completed: boolean }[];
  completed: boolean;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  background: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  npcs: string[];
  music?: string;
  ambientSound?: string;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  targetScene?: string;
  targetSpawn?: string;
  action?: string;
  requiredItem?: string;
  requiredQuest?: { questId: string; objectiveIndex: number };
  lockedMessage?: string;
}

export interface Npc {
  id: string;
  name: string;
  subtitle?: string;
  color: string;
  scene: string;
  position: { x: number; y: number };
  sprite: string;
}

export interface DialogueNodeData {
  speaker: string;
  text: string;
  onComplete?: () => void;
}

export interface DialogueTree {
  npcId: string;
  greeting: string;
  nodes: Record<string, { speaker: string; text: string; choices: any[] }>;
}

export interface HotspotResult {
  id: string;
  success: boolean;
  message: string;
  itemsGiven?: string[];
  questsCompleted?: string[];
  sceneChanged?: string;
}

export interface InventoryEngine {
  add(itemId: string): void;
  remove(itemId: string): void;
  has(itemId: string): boolean;
  selectedItem: string | null;
  selectItem(itemId: string | null): void;
  items: string[];
}

export interface SaveData {
  currentScene: string;
  visitedScenes: string[];
  inventory: string[];
  selectedItem: string | null;
  flags: Record<string, any>;
  playTime: number;
  quests: Record<string, QuestState>;
  dialogueHistory: Record<string, string[]>;
  reputation: number;
  ending?: string;
  settings: Record<string, any>;
}

export interface GameStore {
  state: SaveData;
  setState(partial: Partial<SaveData>): void;
  save(): void;
  load(): SaveData | null;
  reset(): void;
}

export type RendererType = 'canvas' | 'phaser';

export interface GameRenderer {
  start(sceneId: string): void;
  transitionTo(sceneId: string): void;
  shutdown(): void;
}

export interface Achievement {
  gameId: string;
  achievementId: string;
}

export interface TextBoxOptions {
  text: string;
  onClose: () => void;
}

export interface GameLoopAdapter {
  init(): void;
  start(): void;
  run(): void | Promise<void>;
  end(): void;
  engine: any;
  game: any;
}

export interface SceneData {
  sceneId: string;
  visited: boolean;
  data: any;
  spawn: { x: number; y: number };
}

export interface GameSceneManager {
  load(): Promise<void>;
  currentScene: SceneData | null;
  transitionTo?(sceneId: string): void;
}

export interface Screen {
  id: string;
  title: string;
  render: () => string | Promise<string>;
  destroy(): void | Promise<void>;
  focus(): void;
}

export interface ContentManager {
  scenes: GameSceneManager;
  currentScene: Scene;
  currentSceneData: any;
  sceneData: Record<string, any>;
  currentSceneWorld: { x: number; y: number } | null;
}

export interface Textbox {
  render: () => HTMLElement;
}

export interface HotspotEngine {
  canInteract: boolean;
  interact(): HotspotResult | null;
}

export interface DialogueEngine {
  canInteract: boolean;
  interact(): HotspotResult | null;
}

export interface HotspotResult {
  id: string;
  success: boolean;
  message: string;
  itemsGiven?: string[];
  questsCompleted?: string[];
  sceneChanged?: string;
}

export interface DialogueEngine {
  canInteract: boolean;
  interact(options: { npcId?: string; choiceId?: string }): HotspotResult | null;
}
