import { useGameStore } from '../../store/gameStore';

export class AchievementEngine {
  private store: any = null;

  init(): void {
    this.store = useGameStore;
  }

  award(title: string, details: string): void {
    console.info('Achievement:', title, details);
  }

  evaluate?(ending: string): void {
    if (ending === 'keynote-speaker') this.award('Speaker', 'Delivered the keynote.');
    if (ending === 'wifi-down') this.award('Oops', 'Brought down the Wi-Fi.');
  }
}

export const achievementEngine = new AchievementEngine();
