# Conference Quest — Fix Tasks

Work through these in order. Each task is self-contained.
Project root: `/mnt/shared/code/Hearbeat/leisure-larry/conference-quest/`

---

## Task 1 — Fix `GameEngine.ts` imports

**File:** `src/GameEngine.ts`

The file lives at `src/GameEngine.ts` but its imports use `../` which points outside `src/`.
All paths must be changed to `./`.

**Changes required:**

| Old import path | New import path |
|---|---|
| `'../types'` | `'./types'` |
| `'../data/loader'` | `'./data/loader'` |
| `'../world/constants'` | `'./world/constants'` |
| `'../store/gameStore'` | `'./store/gameStore'` |
| `'../engine/navigation'` | `'./engine/navigation'` |
| `'../engine/hotspots'` | `'./engine/hotspots'` |
| `'../engine/dialogue'` | `'./engine/dialogue'` |
| `'../engine/systems/questEngine'` | `'./engine/systems/questEngine'` |
| `'../engine/systems/endingEngine'` | `'./engine/systems/endingEngine'` |

Also fix the `loadDialogues` destructuring bug on line ~55:

```ts
// WRONG
const { dialogueTrees } = await loadDialogues();

// CORRECT — loadDialogues() returns DialogueTree[], not an object
const dialogueTrees = await loadDialogues();
```

---

## Task 2 — Fix `GameContext.tsx`

**File:** `src/GameContext.tsx`

**Remove** these imports at the top (they are unused or the files don't exist):

```ts
import { CanvasRenderer } from './engine/renderer';
import { NavigationBar } from './ui/components/NavigationBar';
import { InventoryUI } from './ui/components/InventoryUI';
import { QuestLogUI } from './ui/components/QuestLogUI';
import { SettingsUI } from './ui/components/SettingsUI';
import { SaveLoadUI } from './ui/components/SaveLoadUI';
import { NotificationUI } from './ui/components/NotificationUI'; // file does not exist
import { endings, triggerEnding } from './engine/systems/endingEngine'; // keep triggerEnding, drop endings
```

**Add** `settings` and `updateSettings` to the `GameContextValue` interface:

```ts
import type { GameEnding, GameSettings } from './types/game';

export interface GameContextValue {
  // ... existing fields ...
  settings: GameSettings;
  updateSettings: (s: Partial<GameSettings>) => void;
}
```

**Make the provider reactive** — add a `useGameStore` selector inside `GameProvider`
so it re-renders when the scene changes:

```ts
export function GameProvider({ children }: GameProviderProps) {
  const [engine, setEngine] = useState<...>(null);
  const [loading, setLoading] = useState(true);

  // This line causes re-render on navigation
  const _currentScene = useGameStore((s) => s.currentScene);

  // ... rest of provider unchanged ...
}
```

**Add** `settings` and `updateSettings` to the `<GameContext.Provider value={...}>` object:

```ts
settings: useGameStore.getState().settings,
updateSettings: (s) => useGameStore.getState().updateSettings(s),
```

---

## Task 3 — Fix `data/loader.ts`

**File:** `src/data/loader.ts`

`Quest` type is used in `loadQuests()` return but is never imported.

Add this import at the top:

```ts
import type { Quest } from '../types/game';
```

---

## Task 4 — Fix `DialogueUI.tsx`

**File:** `src/ui/DialogueUI.tsx`

Line 1 imports `useGameContext` but the component never uses it.
Remove the entire line:

```ts
import { useGameContext } from '../GameContext'; // DELETE THIS LINE
```

---

## Task 5 — Verify everything works

Run from `conference-quest/`:

```bash
npx tsc --noEmit
```

Expected output: nothing (no errors).

Then check the dev server at `http://localhost:3000/` loads without a white screen or overlay error.

If the dev server is not running, start it with:

```bash
npm run dev
```
