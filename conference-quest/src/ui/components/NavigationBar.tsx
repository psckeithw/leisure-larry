import { useGameContext } from '../../GameContext';

export function NavigationBar() {
  const { state, navigate, scene } = useGameContext();
  const scenes = ['hotel-lobby','registration-desk','expo-hall','vendor-row','coffee-bar','conference-theater','rooftop-lounge','casino-floor','server-room','vip-event','demo-room'];

  return (
    <nav className="navigation" aria-label="Location navigation">
      {scenes.map((id) => (
        <button
          key={id}
          type="button"
          className={`nav-item ${state.currentScene === id ? 'nav-item--active' : ''} ${state.visitedScenes.includes(id) ? 'nav-item--visited' : ''}`}
          onClick={() => navigate(id)}
          aria-current={state.currentScene === id ? 'true' : undefined}
        >
          {scene?.id === id ? scene.name : id.replace(/-/g, ' ')}
        </button>
      ))}
    </nav>
  );
}
