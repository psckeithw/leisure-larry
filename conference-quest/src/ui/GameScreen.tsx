const UNIQUE = (items: string[]) => Array.from(new Set(items));
const CHOICES = ['1', '2', '3', '4', '5'];
const PRIORITY = ['speaker-pass', 'presentation-data', 'lost-badge', 'usb-drive'];

export function InventoryUI() {
  return (
    <aside id="inventory" class="inventory-panel" role="complementary" aria-label="Inventory">
      <h2 class="inventory-title">Inventory</h2>
      <ul class="inventory-list">
        <For each={UNIQUE(state.inventory)}>
          {(item: string) => (
            <li class="inventory-item" tabIndex={0} aria-label={item}>
              <span class="inventory-icon">🎒</span>
              <span class="inventory-name">{item}</span>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}

export function QuestLogUI() {
  const quests = () => Object.values(state.quests);
  return (
    <aside id="quest-log" class="quest-panel" role="complementary" aria-label="Quest log">
      <h2 class="quest-title">Quests</h2>
      <ul class="inventory-list">
        <For each={quests()}>
          {(q: any) => (
            <li class="inventory-item" aria-label={q.title}>
              <span class="inventory-icon">📋</span>
              <span class="inventory-name">{q.title}</span>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
}

export function SettingsUI() {
  const settings = () => state.settings;
  return (
    <dialog id="settings" class="settings-panel" aria-label="Settings">
      <div class="settings-content">
        <h2>Settings</h2>
        <div>
          <label for="text-speed">Text Speed</label>
          <input id="text-speed" type="range" min="10" max="80" value={settings().textSpeed} />
        </div>
        <button type="button">Close</button>
      </div>
    </dialog>
  );
}

export function SaveLoadUI() {
  const handleSave = () => {
    const saved = state.save();
    localStorage.setItem('conference-quest-save', JSON.stringify(saved));
  };
  const handleLoad = () => {
    const raw = localStorage.getItem('conference-quest-save');
    if (raw) {
      const saved = JSON.parse(raw);
      state.load(saved);
    }
  };
  const handleReset = () => {
    state.resetGame();
    resolveReset();
  };
  return (
    <div class="save-panel" role="complementary" aria-label="Save and load">
      <h2>Save / Load </h2>
      <button type="button" onClick={handleSave}>Save</button>
      <button type="button" onClick={handleLoad}>Load</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </div>
  );
}

export function NotificationUI() {
  return (
    <div class="notification-host" aria-live="polite" />
  );
}

export function GameScreen() {
  return (
    <main class="game-root" role="application">
      <CanvasRenderer scene={state.currentScene} />
      <DialogueUI />
      <NavBar gameState={state} />
      <InventoryUI />
      <QuestLogUI />
      <SettingsUI />
      <SaveLoadUI />
      <NotificationUI />
    </main>
  );
}

export function NavigationBar(props: { gameState: any }) {
  return (
    <nav class="navigation" aria-label="Location navigation">
      <For each={['hotel-lobby','registration-desk','expo-hall','vendor-row','coffee-bar','conference-theater','rooftop-lounge','casino-floor','server-room','vip-event','demo-room']}>
        {(id: string) => (
          <button
            type="button"
            classList={{
              'nav-item': true,
              'nav-item--active': props.gameState.currentScene === id,
              'nav-item--visited': props.gameState.visitedScenes.includes(id),
            }}
            onClick={() => navigation.moveTo(id)}
            aria-current={props.gameState.currentScene === id ? 'true' : undefined}
          >
            {scenes.find((scene) => scene.id === id)?.name ?? id}
          </button>
        )}
      </For>
    </nav>
  );
}

export function App() {
  return (
    <GameScreen />
  );
}
