import type { DialogueTree, DialogueNode } from '../types';
import { useGameStore } from '../store/gameStore';

class DialogueEngineInstance {
  private tree: DialogueTree = { npcId: '', greeting: '', nodes: {} };

  loadTree(tree: DialogueTree): void {
    this.tree = tree;
  }

  start(): string {
    return this.tree.greeting;
  }

  select(nodeId: string, choiceId: string): string | null {
    const node = this.tree.nodes[nodeId];
    if (!node) return null;
    const choice = node.choices.find((c) => c.id === choiceId);
    if (!choice) return null;
    if (choice.effect) choice.effect(useGameStore.getState());
    return choice.next;
  }

  node(nodeId: string): DialogueNode | undefined {
    return this.tree.nodes[nodeId];
  }
}

export const dialogueEngine = new DialogueEngineInstance();

export function loadDialogueTree(tree: DialogueTree): void {
  dialogueEngine.loadTree(tree);
}
