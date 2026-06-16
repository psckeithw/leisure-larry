# Conference Quest — Handoff Document

## Project Root
`/mnt/shared/code/Hearbeat/leisure-larry/conference-quest/`

## What's Done
- Vite + React + TypeScript project scaffolded
- package.json set for React (not SolidJS)
- `src/data/` JSON content layer complete and validated:
  - `items.json`, `quests.json`, `scenes.json`, `npcs.json`, `dialogues.json`
- `src/types.ts` defines Item, Scene, Npc, Quest, GameState, etc.
- `src/engine/` directory with attempt at Phaser + dialogue/runtime integration
- `src/world/data.ts` contains complete hardcoded game data (fallback)
- `src/store/gameStore.ts` Zustand store
- `src/state/index.ts` StateEngine with save/load
- `src/engine/hotspots.ts` hotspot action handlers
- `src/engine/dialogue.ts` DialogueEngine
- `src/ui/` has DialogueUI, InventoryUI, QuestLogUI, SaveLoadUI, SettingsUI stubs
- `src/runtime/runtime.ts` GameRuntime skeleton

## Known Issues
1. Mixed framework fragments: some files import from `solid-js`, solid references remain in `tsconfig.app.json`
2. `src/engine/` has Phaser code that was never fully integrated
3. `src/App.tsx` is still the default Vite template (counter)
4. `src/main.tsx` still imports from `solid-js`
5. `runtime/runtime.ts` was replaced with just re-exports, runtime logic is in `src/engine/`
6. Multiple broken imports across files due to path/framework mismatches
7. `node_modules` is empty — deps not installed in current working dir

## What's Missing (to make playable)
1. Fix `tsconfig.app.json` — remove solid-js references, set `jsx: "react-jsx"`
2. Install deps: `npm install` in `conference-quest/`
3. Delete broken `src/engine/scenes/` Phaser code (not used)
4. Write `src/App.tsx` — the actual game screen
5. Write `src/styles.css` — retro VGA dark theme
6. Write `src/GameEngine.ts` — connects data → state → UI
7. Wire save/load with localStorage
8. Verify `npm run dev` starts and game renders

## Key Design Decisions
- 10 locations, 9 NPCs, branching dialogue, quest tracking
- All content in JSON (`src/data/`)
- React UI shell overlays engine
- Canvas-based renderer in `src/engine/renderer.ts`
- Zustand for reactive UI state

## Next Session Goals
1. Clean up framework mismatch (React only)
2. Get `npm run dev` working
3. Build playable MVP: lobby → talk to Marlene → find badge → fix vendor demo → recover slides → deliver keynote
4. Test all 5 endings
