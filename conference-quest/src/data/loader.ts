import type { Item, Scene, Npc, DialogueTree, Quest } from '../types/game';

export async function loadGameData(): Promise<{
  items: Item[];
  scenes: Scene[];
  npcs: Npc[];
  itemMap: Map<string, Item>;
  sceneMap: Map<string, Scene>;
  npcMap: Map<string, Npc>;
}> {
  const [itemsRaw, scenesRaw, npcsRaw] = await Promise.all([
    import('./items.json'),
    import('./scenes.json'),
    import('./npcs.json'),
  ]);

  const items = itemsRaw.default as Item[];
  const scenes = scenesRaw.default as Scene[];
  const npcs = npcsRaw.default as Npc[];

  const itemMap = new Map(items.map(item => [item.id, item]));
  const sceneMap = new Map(scenes.map(scene => [scene.id, scene]));
  const npcMap = new Map(npcs.map(npc => [npc.id, npc]));

  return { items, scenes, npcs, itemMap, sceneMap, npcMap };
}

export async function loadQuests() {
  const mod = await import('./quests.json');
  return mod.default as Quest[];
}

export async function loadDialogues() {
  const mod = await import('./dialogues.json');
  return mod.default as DialogueTree[];
}
