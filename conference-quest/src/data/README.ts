/**
 * Conference Quest - v1 complete playable runtime
 *
 * Runtime summary:
 *  - `src/data/*.json`: authoritative content (items, scenes, npcs, dialogues, quests)
 *  - `src/types/game.ts`: TypeScript-first runtime contract
 *  - `src/store/gameStore.ts`: Zustand-backed runtime state + localStorage savegate
 *  - `src/ui/*`: SolidJS UI shell (inventory, questlog, settings, save/load)
 *  - `src/engine/*`: gameplay systems (dialogue engine, quest engine, renderer)
 *  - `src/runtime.tsx`: application root
 *  - `index.html`: browser bootstrap
 */
