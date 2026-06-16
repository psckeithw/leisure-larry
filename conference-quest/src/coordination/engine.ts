import { StateLayer } from './StateLayer';
import { RecombinationRules } from './recombinationRules';
import { QuestManager } from './QuestManager';
import type { GameStore, QuestState } from '../types';

export class GameEngine {
  public state = new StateLayer();
  public quests = new QuestManager(this.state);
  public recombinator = new RecombinationRules(this.state);
  private initialized = false;

  init(initialState?: GameStore) {
    if (this.initialized) return;
    this.state.init(initialState);
    this.initialized = true;
  }

  getQuest(id: string): QuestState | undefined {
    return this.state.getState().quests[id];
  }

  updateQuestProgress(questId: string, objectiveIndex: number): void {
    this.state.updateQuestProgress(questId, objectiveIndex);
  }

  addItem(itemId: string): void {
    this.state.addItem(itemId);
  }

  removeItem(itemId: string): void {
    this.state.removeItem(itemId);
  }

  setFlag(key: string, value: boolean): void {
    this.state.setFlag(key, value);
  }

  hasFlag(key: string): boolean {
    return this.state.hasFlag(key);
  }

  addReputation(amount: number): void {
    this.state.addReputation(amount);
  }

  getState() {
    return this.state.getState();
  }

  save() {
    this.state.save();
  }

  load() {
    this.state.load();
  }

  reset() {
    this.state.reset();
  }
}

export const gameEngine = new GameEngine();
