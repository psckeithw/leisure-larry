import { useGameContext } from '../../GameContext';

export function SaveLoadUI() {
  const { resetGame } = useGameContext();

  return (
    <div className="save-panel" role="complementary" aria-label="Save and load">
      <span className="save-hint">Auto-save enabled</span>
      <button type="button" onClick={resetGame}>Reset Game</button>
    </div>
  );
}
