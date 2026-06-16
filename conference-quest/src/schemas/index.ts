import { z } from 'zod';

import type { Item, Npc, Scene, Hotspot, DialogueNode, DialogueChoice, Quest, GameState, Setting } from './types';

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  keyItem: z.boolean().optional(),
  combinable: z.array(z.string()).optional(),
  usableOn: z.array(z.string()).optional(),
  consumable: z.boolean().optional(),
});

const DialogueChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextNode: z.union([z.literal('end'), z.string()]),
  condition: z.any().optional(),
  effect: z.any().optional(),
  reputation: z.number().optional(),
});

const DialogueNodeSchema = z.object({
  id: z.string(),
  speaker: z.string(),
  text: z.string(),
  choices: z.array(DialogueChoiceSchema),
  onEnter: z.any().optional(),
});

const SceneSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  background: z.string(),
  width: z.number(),
  height: z.number(),
  music: z.string().optional(),
  ambientSound: z.string().optional(),
  onEnter: z.string().optional(),
  hotspots: z.array(
    z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      label: z.string(),
      targetScene: z.string().optional(),
      targetSpawn: z.string().optional(),
      action: z.string().optional(),
      requiredItem: z.string().optional(),
      requiredQuest: z
        .object({ questId: z.string(), objectiveIndex: z.number() })
        .optional(),
      lockedMessage: z.string().optional(),
    })
  ),
  npcs: z.array(z.string()),
});

const QuestObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  completed: z.boolean().optional().default(false),
  hidden: z.boolean().optional(),
});

const QuestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  objectives: z.array(QuestObjectiveSchema),
  completed: z.boolean().optional().default(false),
  rewardReputation: z.number().optional(),
  rewardItems: z.array(z.string()).optional(),
  triggersQuest: z.string().optional(),
  onComplete: z.string().optional(),
});

const SettingSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['toggle', 'range', 'choice']),
  value: z.union([z.boolean(), z.number(), z.string()]),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const GameStateSchema = z.object({
  inventory: z.array(z.string()),
  selectedItem: z.string().nullable(),
  flags: z.record(z.union([z.boolean(), z.number(), z.string()])).optional().default({}),
  currentScene: z.string(),
  visitedScenes: z.array(z.string()),
  quests: z.record(QuestSchema),
  dialogueHistory: z.record(z.array(z.string())),
  playTime: z.number().optional(),
  ending: z.string().nullable().optional(),
  settings: z.array(SettingSchema),
  reputation: z.number().optional(),
});

export function validateItem(data: unknown): Item {
  return ItemSchema.parse(data);
}

export function validateScene(data: unknown): Scene {
  return SceneSchema.parse(data);
}

export function validateQuest(data: unknown): Quest {
  return QuestSchema.parse(data);
}

export function validateGameState(data: unknown): GameState {
  return GameStateSchema.parse(data);
}
