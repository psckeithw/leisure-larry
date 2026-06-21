export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  keyItem?: boolean;
}

export interface Npc {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  scene: string;
  position: { x: number; y: number };
  sprite: string;
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
  lockedMessage?: string;
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
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  completed: boolean;
}

export interface QuestState {
  id: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  completed: boolean;
}

export interface DialogueTree {
  npcId: string;
  greeting: string;
  nodes: Record<string, DialogueNode>;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices: DialogueChoice[];
  onEnter?: (state: any) => void;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNode: string | 'end';
  effect?: (state: any) => void;
  condition?: (state: any) => boolean;
  reputation?: number;
}

export interface GameState {
  scene: string;
  inventory: string[];
  reputation: number;
  flags: Record<string, boolean>;
  quests: Record<string, QuestState>;
  dialogueHistory: Record<string, string[]>;
  settings: {
    music: boolean;
    sfx: boolean;
    textSpeed: number;
  };
}

export interface SceneTransition {
  from: string;
  to: string;
  spawn: string;
}

export interface GameLoopStep {
  id: string;
  label: string;
  hex: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  reward: string;
  steps: string[];
  completed: boolean;
}

export type ItemId = string;
export type SceneId = string;
export type NpcId = string;
export type QuestId = string;
export type DialogueNodeId = string;
export type GameEnding = 'keynote-speaker' | 'startup-recruit' | 'conference-organizer' | 'wifi-down' | 'no-accomplishment';

export interface RoomData {
  id: string;
  name: string;
  description: string;
  hex: string;
  neighbors: string[];
  npcs: Npc[];
}

export interface Puzzle {
  id: string;
  description: string;
  solution: string[];
  reward?: string;
}

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: Objective[];
  completed: boolean;
  reward?: string;
}

export interface SaveData {
  scene: string;
  inventory: string[];
  reputation: number;
  flags: Record<string, boolean>;
  quests: Record<string, QuestState>;
  dialogueHistory: Record<string, string[]>;
  settings: {
    music: boolean;
    sfx: boolean;
    textSpeed: number;
  };
  timestamp: number;
}

export type GameEventType =
  | 'scene-change'
  | 'inventory-update'
  | 'dialogue-start'
  | 'dialogue-end'
  | 'quest-update'
  | 'notification'
  | 'ending';

export interface GameEvent {
  type: GameEventType;
  payload: any;
}

export type EventHandler = (event: GameEvent) => void;
