import type { Item, DialogueTree, Scene, Npc } from '../types/game';
import type { Quest } from '../types/game';

export interface DataProvider {
  getItems(): Item[];
  getScenes(): Scene[];
  getNpcs(): Npc[];
  getDialogues(): DialogueTree[];
  getQuests(): Quest[];
  getItem(id: string): Item | undefined;
  getScene(id: string): Scene | undefined;
  getNpc(id: string): Npc | undefined;
  getDialogueTree(npcId: string): DialogueTree | undefined;
  getQuest(id: string): Quest | undefined;
}

export class JsonDataProvider implements DataProvider {
  private items: Item[] = [];
  private scenes: Scene[] = [];
  private npcs: Npc[] = [];
  private dialogues: DialogueTree[] = [];
  private quests: Quest[] = [];

  async load(): Promise<void> {
    const [items, scenes, npcs, dialogues, quests] = await Promise.all([
      import('../data/items.json'),
      import('../data/scenes.json'),
      import('../data/npcs.json'),
      import('../data/dialogues.json'),
      import('../data/quests.json'),
    ]);

    this.items = items.default;
    this.scenes = scenes.default;
    this.npcs = npcs.default;
    this.dialogues = dialogues.default;
    this.quests = quests.default;
  }

  getItems(): Item[] { return this.items; }
  getScenes(): Scene[] { return this.scenes; }
  getNpcs(): Npc[] { return this.npcs; }
  getDialogues(): DialogueTree[] { return this.dialogues; }
  getQuests(): Quest[] { return this.quests; }
  getItem(id: string): Item | undefined { return this.items.find(i => i.id === id); }
  getScene(id: string): Scene | undefined { return this.scenes.find(s => s.id === id); }
  getNpc(id: string): Npc | undefined { return this.npcs.find(n => n.id === id); }
  getDialogueTree(npcId: string): DialogueTree | undefined { return this.dialogues.find(d => d.npcId === npcId); }
  getQuest(id: string): Quest | undefined { return this.quests.find(q => q.id === id); }
}
