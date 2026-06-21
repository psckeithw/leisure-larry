import { loadQuests, loadDialogues, loadGameData } from '../../data/loader';

export class QuestEngine {
  private store: any = null;
  private quests: any[] = [];
  private dialogueTrees: any[] = [];

  init(store: any): void {
    this.store = store;
    this.rebuildFromStore().catch(console.error);
    if (typeof store?.subscribe === 'function') {
      store.subscribe((s: any) => this.onStoreChanged(s));
    }
  }

  private async rebuildFromStore(): Promise<void> {
    const [quests, dialogueTrees] = await Promise.all([
      loadQuests(),
      loadDialogues(),
    ]);
    this.quests = quests;
    this.dialogueTrees = dialogueTrees;
  }

  private onStoreChanged(state: any): void {
    if (!state?.quests) return;
    const unstarted = this.quests.filter(q => !(q.id in state.quests));
    unstarted.forEach((quest) => {
      if (typeof this.store?.startQuest === 'function') {
        this.store.startQuest(quest.id);
      }
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
