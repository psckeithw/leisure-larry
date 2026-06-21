# Handoff — Conference Quest Recovery & Triage

## What I Did

I investigated the project at `/mnt/shared/code/Hearbeat/leisure-larry` after the user reported that files were missing.

### Findings
- **No files were actually deleted.** The project is fully intact in git. The directory `conference-quest/` contains the complete React + TypeScript + Vite game code, and `platform/ai-mimo/` contains the Terraform infrastructure.
- Git showed 5 modified tracked files and several untracked files, but zero deleted tracked files.
- `node_modules` is installed; `npx tsc --noEmit` passes; `npm run dev` starts successfully.

### Fixes Applied
1. **`src/App.tsx`** — rewrote dialogue flow:
   - `handleDialogue` now reads `useGameStore.getState().currentNodeId` and `dialogueEngine.node()` instead of calling `advanceDialogue('__start__')` (which returned `null` and prevented the overlay from opening).
   - `advanceDialogue` now updates the local dialogue state with the next node text/choices.
   - Added a `message` state for hotspot feedback instead of resetting the game.
   - Passed `ctx.npcsHere` to `CanvasRenderer.mount()` so NPCs are drawn.
2. **`src/engine/renderer.ts`** — added NPC rendering:
   - `mount()` accepts an optional `npcs` array.
   - Draws each NPC as a colored circle with initials and name label.
   - Uses normalized positions (`0-1` range from JSON) multiplied by canvas size.
3. **`src/GameEngine.ts`** — imports were already using `./` correctly; `loadDialogues()` destructuring bug was already fixed.
4. **`src/GameContext.tsx`** — imports and reactivity were already correct.
5. **`src/data/loader.ts`** — `Quest` import was already present.

### What Is Still Broken / Needs Work

1. **Dialogue overlay shows "NPC" instead of the character name.**
   - `DialogueUI.tsx` uses `node?.speaker`, but the dialogue tree stores the NPC id (e.g. `registration-manager`). The component should look up `NPCS.find(n => n.id === speaker)?.name` or accept a separate `speakerName` prop.
2. **Dialogue choices have no text in the overlay.**
   - `App.tsx`'s `advanceDialogue` stores the raw `DialogueNode` from `dialogueEngine.node()`. `DialogueUI.tsx` reads `node.choices`, but the rendered buttons show blank. Check that `DialogueUI.tsx` is actually rendering `choice.text` (the current component does). If still blank, verify `dialogueEngine.node()` returns the correct node after `select()`.
3. **NPC buttons may not render.**
   - `npcsHere` comes from `engine.getNpcsHere(engine.getScene())`. If `scene.npcs` in the JSON uses IDs that don't match the NPC map keys, the list will be empty. Verify the hotel-lobby scene references `registration-manager` and `influencer`, and that those IDs exist in `src/data/npcs.json`.
4. **Hotspot navigation does not work.**
   - `NavigationManager.canMoveTo()` checks `current.hotspots.find(h => h.targetScene === targetScene)`. If the hotspot exists but `navigation.moveTo()` returns `false`, the scene will not change. Add console logging or a temporary alert to see if `moveTo()` is being called and what it returns.
5. **Renderer draws empty scene.**
   - `App.tsx` passes `background: ''` to `renderer.mount()`. The renderer ignores background and draws a solid dark rect. If you want scene backgrounds, you need image assets and a loading path.
6. **Missing assets.**
   - `src/assets/` only has `hero.png`, `react.svg`, `vite.svg`. There are no NPC sprites or scene backgrounds. The renderer currently draws placeholder shapes. You either need to add the PNG assets or keep the abstract canvas rendering.
7. **`GameStateManager.ts` references `Phaser` and `DEFAULT_SETTINGS` (with a space in `DEFAULT_SETTING S`).**
   - This file is dead code (not imported anywhere), but if you plan to integrate it, fix the typo and remove the Phaser dependency.
8. **`handoff.md` in `conference-quest/`** exists and may contain prior context. Read it before making gameplay changes.

## What the Next Agent Should Do

1. **Read `conference-quest/handoff.md`** for original design intent.
2. **Playtest at `http://localhost:3000`** using Playwright or a real browser. Capture a screenshot of the dialogue overlay and NPC buttons.
3. **Fix dialogue speaker names** in `DialogueUI.tsx` by mapping speaker ids to names from `src/data/npcs.json` (or `NPCS` in `src/world/data.ts`).
4. **Verify `advanceDialogue` updates choices.** Add a `console.log` in `DialogueUI.tsx` to print `node` on render. If `choices` is empty, debug `dialogueEngine.select()` and `dialogueEngine.node()`.
5. **Add image assets** or keep the canvas abstraction. If adding images, load them in `renderer.ts` using `new Image()` and `onload`.
6. **Remove `resetGame()` from `handleHotspot`** if the user wants non-destructive feedback (already done in the current `App.tsx`).
7. **Consider integrating `questEngine`** so quests auto-start when conditions are met. Currently `questEngine.init()` is never called.
8. **Clean up dead imports** in `GameEngine.ts` (`questEngine` is imported but unused) and `GameContext.tsx` (`triggerEnding` is imported but not used after refactor).

## Commands

```bash
cd /mnt/shared/code/Hearbeat/leisure-larry/conference-quest
npm run dev        # starts server at localhost:3000
npx tsc --noEmit   # type check
npx playwright test # if tests exist
```

## Architecture Notes

- **State:** Zustand store in `src/store/gameStore.ts`.
- **Engine:** `createGameEngine()` in `src/GameEngine.ts` builds the game object. It is async because it loads JSON data files.
- **Dialogue:** `src/engine/dialogue.ts` holds a singleton `DialogueEngineInstance`. `loadDialogueTree()` loads a tree; `start()` returns the greeting node id; `select()` returns the next node id or `'end'`.
- **Navigation:** `src/engine/navigation.ts` wraps store scene changes and enforces hotspot-based movement rules.
- **Renderer:** `src/engine/renderer.ts` draws hotspots and NPCs on a `<canvas>`. No background images yet.
