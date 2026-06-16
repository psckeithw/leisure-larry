import { store } from '../world/store';
import { questMap } from '../world/data';

export class Achievements {
  private history: { achievement: string; timestamp: number }[] = [];

  constructor() {
    this.history = [];
  }

  reset() {
    this.history = [];
  }

  complete(achievement: string) {
    this.history.push({ achievement, timestamp: Date.now() });
  }

  status() {
    return { history: this.history };
  }
}

export const achievements = new Achievements();

export const tryGrantAchievement = (achievementId: string, predicate: () => boolean): void => {
  if (predicate()) {
    achievements.complete(achievementId);
  }
};

export const achievementState = () => {
  return achievements;
};

export const grantOnComplete = (questId: string, achievementId: string): void => {
  const quest = store.quests[questId];
  if (quest && quest.completed) {
    achievements.complete(achievementId);
  }
};

type Achievement = { id: string; description: string };

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'explorer', description: 'Visit every location' },
  { id: 'badge-hunter', description: 'Recover your badge' },
  { id: 'vendor-hero', description: 'Fix the crashing demo' },
  { id: 'slide-racer', description: 'Recover the keynote slides' },
  { id: 'hotel-hero', description: 'Receive the Speaker Pass' },
  { id: 'keynote-star', description: 'Deliver the keynote speech' },
  { id: 'startup-hire', description: 'Accept a startup offer' },
  { id: 'organizer', description: 'Become the new organizer' },
  { id: 'clinical', description: 'Became conference organizer' },
  { id: 'wifi-wrecker', description: 'Accidentally brought down the Wi-Fi' },
  { id: 'joker', description: 'Generate enough laughs to survive' },
];
