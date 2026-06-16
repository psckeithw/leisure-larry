import { loadQuests, loadDialogues, loadGameData } from '../../data/loader';
import type { QuestState, GameState } from '../../store/gameStore';

export class QuestEngine {
  private store: any = null;
  private quests: any[] = [];
  private dialogueTrees: any[] = [];

  init(store: any): void {
    this.store = store;
    this.rebuildFromStore();
    store.subscribe((s: GameState) => this.onStoreChanged(s));
  }

  private async rebuildFromStore(): Promise<void> {
    const [quests, dialogueTrees] = await Promise.all([
      loadQuests(),
      loadDialogues(),
    ]);
    this.quests = quests;
    this.dialogueTrees = dialogueTrees;
  }

  private onStoreChanged(state: GameState): void {
    const unstarted = this.quests.filter(q => !(q.id in state.quests));
    unstarted.forEach((quest) => {
      const objectives = quest.objectives.map(obj => ({
        id: obj.id,
        description: obj.description,
        completed: obj.completed ?? false,
      }));
      this.store.startQuest(quest.id);
    });
  }

  getQuest(id: string): any | undefined {
    return this.quests.find(q => q.id === id);
  }

  resolveDialogue(npcId: string, nodeId: string): any | null {
    const tree = this.dialogueTrees.find(d => d.npcId === npcId);
    if (!tree) return null;
    return tree.nodes[nodeId] ?? null;
  }
}

export const questEngine = new QuestEngine();
