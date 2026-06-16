import { useGameContext } from '../../GameContext';

export function QuestLogUI() {
  const { state } = useGameContext();
  const quests = Object.values(state.quests);

  return (
    <aside id="quest-log" className="quest-panel" role="complementary" aria-label="Quest log">
      <h2 className="quest-title">Quests</h2>
      <ul className="inventory-list">
        {quests.length === 0 && <li className="inventory-empty">No active quests</li>}
        {quests.map((q: any) => (
          <li key={q.id} className="inventory-item quest-item" aria-label={q.title}>
            <span className="inventory-icon">{q.completed ? '✅' : '📋'}</span>
            <span className="inventory-name">{q.title}</span>
            {q.objectives && (
              <ul className="quest-objectives">
                {q.objectives.map((obj: any) => (
                  <li key={obj.id} className={obj.completed ? 'objective-done' : 'objective-pending'}>
                    {obj.completed ? '✓' : '○'} {obj.description}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
