import { store } from '../world/store';
import { triggerContractEnding } from './workloop';
import { validEndings } from '../types';

const tracking: { badgeTaken: boolean; slidesTaken: boolean; interactive: boolean } = {
  badgeTaken: false,
  slidesTaken: false,
  interactive: false,
};

export type MissionId =
  | 'm-badge'
  | 'm-slides'
  | 'm-vendor'
  | 'm-wifi'
  | 'm-keynote'
  | 'm-organizer'
  | 'm-startup';

export const missions = {
  clear() {
    tracking.badgeTaken = false;
    tracking.slidesTaken = false;
    tracking.interactive = false;
  },

  record(event: 'badge' | 'slides' | 'interactive') {
    if (event === 'badge') tracking.badgeTaken = true;
    if (event === 'slides') tracking.slidesTaken = true;
    if (event === 'interactive') tracking.interactive = true;
  },

  onContractComplete(endingId: string) {
    triggerContractEnding(endingId);
  },
};

export const getQuestState = (questId: string): QuestState | undefined => {
  return store.quests[questId];
};

export const completeQuest = (questId: string, rewardItem?: string, rewardRep = 0): void => {
  if (rewardItem) store.addToInventory(rewardItem);
  store.changeReputation(rewardRep);
  store.updateQuestProgress(questId, 0);
};

export const hasQuestCompleted = (questId: string): boolean => {
  const quest = store.quests[questId];
  return !!quest?.completed;
};

export const getActiveQuests = (): string[] => {
  return Object.keys(store.quests).filter(questId => {
    const quest = store.quests[questId];
    return !quest.completed;
  });
};

export const getEnding = () => {
  return store.getState().ending;
};

export const awardEnding = (ending: validEndings): void => {
  store.update({ ending });
  missions.onContractComplete(ending);
};
