export type ItemId = string;
export type SceneId = string;
export type NpcId = string;
export type QuestId = string;
export type DialogueNodeId = string;

export interface Item {
  id: ItemId;
  name: string;
  description: string;
  icon: string;
  combinable?: { with: ItemId[]; result: ItemId; description: string };
  usableOn?: { target: string; result: string; removeItem?: boolean; giveItem?: ItemId };
  consumable?: boolean;
  keyItem?: boolean;
}

export interface InventoryState {
  items: ItemId[];
  selectedItem: ItemId | null;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  hidden?: boolean;
}

export interface Quest {
  id: QuestId;
  title: string;
  description: string;
  objectives: QuestObjective[];
  completed: boolean;
  rewardReputation?: number;
  rewardItems?: ItemId[];
  triggersQuest?: QuestId;
  onComplete?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNode: DialogueNodeId | 'end';
  condition?: (state: GameState) => boolean;
  effect?: (state: GameState) => void;
  reputation?: number;
}

export interface DialogueNode {
  id: DialogueNodeId;
  speaker: NpcId | 'player' | 'system';
  text: string;
  choices: DialogueChoice[];
  onEnter?: (state: GameState) => void;
}

export interface DialogueTree {
  npcId: NpcId;
  greeting: DialogueNodeId;
  nodes: Record<DialogueNodeId, DialogueNode>;
}

export interface Npc {
  id: NpcId;
  name: string;
  subtitle?: string;
  color: string;
  scene: SceneId;
  position: { x: number; y: number };
  sprite: string;
  dialogueTree?: DialogueTree;
  reputationRequired?: number;
  questsAvailable?: QuestId[];
  questsTurnIn?: QuestId[];
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  targetScene?: SceneId;
  targetSpawn?: string;
  action?: string;
  requiredItem?: ItemId;
  requiredQuest?: { questId: QuestId; objectiveIndex: number };
  lockedMessage?: string;
}

export interface Scene {
  id: SceneId;
  name: string;
  description: string;
  background: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
  npcs: NpcId[];
  music?: string;
  ambientSound?: string;
  onEnter?: string;
}

export interface GameState {
  currentScene: SceneId;
  visitedScenes: SceneId[];
  inventory: ItemId[];
  selectedItem: ItemId | null;
  reputation: number;
  quests: Record<QuestId, Quest>;
  dialogueHistory: Record<NpcId, DialogueNodeId[]>;
  flags: Record<string, boolean | number | string>;
  playTime: number;
  ending: string | null;
  settings: GameSettings;
  dialogueActive: boolean;
  dialogueNpc: string | null;
  currentNodeId: string | null;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  textSpeed: number;
  volume: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  textSpeed: 30,
  volume: 0.7,
};

export const INITIAL_SCENE: SceneId = 'hotel-lobby';

export type GameEnding =
  | 'keynote-speaker'
  | 'startup-recruit'
  | 'conference-organizer'
  | 'wifi-down'
  | 'nothing-accomplished';

export const ENDING_TITLES: Record<GameEnding, string> = {
  'keynote-speaker': 'The Main Stage Awaits',
  'startup-recruit': 'Tech Disruptor',
  'conference-organizer': 'The New Organizer',
  'wifi-down': 'Oops, All Servers',
  'nothing-accomplished': 'Better Luck Next Year',
};

export const GAME_START_INTRO = `You're at DevConnect 2026 — the biggest developer conference in the desert. The hotel is impressive, the attendees are more impressive, and your conference badge is... somewhere you left it. Your ambition: deliver the surprise keynote tomorrow night. Your reality: confused, badge-less, and emotionally dependent on coffee. The clock is ticking.`;

