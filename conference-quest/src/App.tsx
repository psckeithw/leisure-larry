import { GameProvider } from './GameContext';
import { GameScreenInner } from './GameScreen';

export default function App() {
  return (
    <GameProvider>
      <GameScreenInner />
    </GameProvider>
  );
}
