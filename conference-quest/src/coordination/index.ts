import { game } from '../../game';
import { GameUI } from './GameUI';

export function getGameContainer(): HTMLElement | null {
  return document.getElementById('game-ui-root');
}

export function mountGameUI(): void {
  const container = getGameContainer();
  if (!container) {
    return;
  }
  GameUI.mount(container);
  game.emit('mount:game-ui', { controller: GameUI });
}

export function activateSceneRoot(): void {
  game.once('scene-ready', (scene: any) => {
    GameUI.get().open(scene);
  });
}

export const coordinateRuntime = { mountGameUI, activateSceneRoot };
