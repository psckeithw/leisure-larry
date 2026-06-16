import { scenes, SCENE_ORDER } from '../world/data';
import { useGameStore, useSelectScene } from '../store/gameStore';
import type { SceneId } from '../world/data';

export interface NavigationOptions {
  targetId: SceneId;
  spawnId?: string;
  requiredItem?: string;
}

export class NavigationManager {
  private visitedScenes = new Set<string>(['hotel-lobby']);
  private unsub: (() => void) | null = null;

  constructor() {
    this.unsub = useGameStore.subscribe((s) => {
      this.visitedScenes = new Set(s.visitedScenes);
    });
    const current = useGameStore.getState();
    this.visitedScenes = new Set(current.visitedScenes);
  }

  public getVisitedScenes(): string[] {
    return Array.from(this.visitedScenes);
  }

  public currentScene(): string {
    return useGameStore.getState().currentScene;
  }

  public canMoveTo(targetScene: string): boolean {
    const current = scenes.find((candidate) => candidate.id === this.currentScene());
    if (!current?.hotspots) return false;
    const target = current.hotspots.find((h) => h.targetScene === targetScene);
    if (!target) return false;
    const state = useGameStore.getState();
    if (target.requiredItem && !state.inventory.includes(target.requiredItem)) return false;
    return true;
  }

  public moveTo(sceneId: string): boolean {
    if (!this.canMoveTo(sceneId)) return false;
    useGameStore.getState().setCurrentScene(sceneId);
    return true;
  }

  public forceSetScene(sceneId: string): void {
    useGameStore.getState().setCurrentScene(sceneId);
  }

  public nextScene(): string | undefined {
    const idx = SCENE_ORDER.indexOf(this.currentScene());
    return SCENE_ORDER[idx + 1];
  }

  public previousScene(): string | undefined {
    const idx = SCENE_ORDER.indexOf(this.currentScene());
    return SCENE_ORDER[idx - 1];
  }

  public destroy(): void {
    if (this.unsub) this.unsub();
  }
}

export const navigation = new NavigationManager();
