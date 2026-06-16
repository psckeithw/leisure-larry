import { v4 as uuid } from 'uuid';
import { store } from '../world/store';
import type { GameEvent, Quest as QuestData, QuestState } from '../types';

type EventName = 'badge-lost' | 'talk-to-marlene' | 'fix-vendor' | 'reach-store' | 'correct-spawn';

export class WorkLoop {
  private sequence: GameEvent[] = [];
  private pointer = 0;
  private complete = false;

  constructor() {
    this.reset();
  }

  reset() {
    this.sequence = [
      {
        id: uuid(),
        label: 'Recover your missing badge before the conference starts',
        action: () => this.advanceIfQuest('badge-quest'),
        weight: 1,
      },
      {
        id: uuid(),
        label: 'Help the vendor rescue the crashing demo',
        action: () => this.advanceIfQuest('vendor-quest'),
        weight: 1,
      },
      {
        id: uuid(),
        label: 'Investigate why the keynote slides disappeared',
        action: () => this.advanceIfQuest('slide-quest'),
        weight: 1,
      },
    ];
    this.pointer = 0;
    this.complete = false;
  }

  currentEvent() {
    return this.complete ? null : this.sequence[this.pointer] ?? null;
  }

  advanceIfQuest(questId: string) {
    const quest = store.quests[questId];
    if (!quest || !quest.completed) return;
    this.advance();
  }

  advance() {
    if (this.complete) return;
    this.pointer += 1;
    if (this.pointer >= this.sequence.length) {
      this.complete = true;
    }
  }

  completeStatus() {
    return this.complete;
  }
}

export const workLoop = new WorkLoop();

export const handleGameEvent = (eventName: EventName): GameEvent | null => {
  const event: GameEvent = {
    id: uuid(),
    label: eventName,
    action: () => advanceWorkflowIfReady(),
    weight: 1,
  };

  switch (eventName) {
    case 'badge-lost':
      store.updateQuestProgress('badge-quest', 0);
      break;
    case 'talk-to-marlene':
      if (event.action) event.action();
      break;
    case 'fix-vendor':
      store.updateQuestProgress('vendor-quest', 2);
      break;
    case 'reach-store':
      store.updateQuestProgress('vendor-quest', 1);
      break;
    default:
      break;
  }

  return event;
};

const advanceWorkflowIfReady = () => {
  workLoop.advanceIfQuest('badge-quest');
  workLoop.advanceIfQuest('vendor-quest');
  workLoop.advanceIfQuest('slide-quest');
};

export const triggerContractEnding = (endingId: string): void => {
  missions.onContractComplete(endingId);
};
