import { describe, it, expect, beforeEach } from 'vitest';
import { dialogueEngine, loadDialogueTree } from '../src/engine/dialogue';
import type { DialogueTree } from '../src/types';
import { useGameStore } from '../src/store/gameStore';

const mockTree: DialogueTree = {
  npcId: '',
  greeting: 'g1',
  startNode: 'g1',
  nodes: {
    g1: {
      id: 'g1',
      speaker: 'npc',
      text: 'Hello.',
      choices: [{ id: 'c1', text: 'Next', nextNode: 'g2' }],
    },
    g2: {
      id: 'g2',
      speaker: 'npc',
      text: 'Bye.',
      choices: [{ id: 'c1', text: 'End', nextNode: null }],
    },
  },
};

describe('dialogueEngine', () => {
  beforeEach(() => {
    loadDialogueTree(mockTree);
    useGameStore.setState({ dialogueActive: false, currentNodeId: null, dialogueNpc: null });
  });

  it('returns the greeting node id from start()', () => {
    expect(dialogueEngine.start()).toBe('g1');
  });

  it('returns nextNode when selecting a choice', () => {
    expect(dialogueEngine.select('g1', 'c1')).toBe('g2');
  });

  it('returns null when dialogue ends', () => {
    expect(dialogueEngine.select('g2', 'c1')).toBeNull();
  });

  it('returns the node text through node()', () => {
    expect(dialogueEngine.node('g1')?.text).toBe('Hello.');
  });
});
