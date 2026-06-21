# Conference Quest MVP

Goal: ship one small, playable vertical slice without changing architecture.

Baseline already verified:
- [x] The project builds successfully.
- [x] The game loads without console errors.

## Handoff Notes

- Treat `conference-quest/` as the only active app. The root workspace `package.json` is not the game.
- The live path is `src/main.tsx -> src/App.tsx -> src/GameContext.tsx -> src/GameScreen.tsx`.
- The current goal is a small playable slice, not cleanup or architecture work.
- Prefer touching only files that are on the live path unless a build error proves a legacy file is blocking the build.
- There are duplicate and legacy files in `src/types.ts`, `src/world/*`, `src/state/*`, `src/coordination/*`, and several `src/engine/*` modules. Do not chase them unless they are directly in the live path or break the build.
- Verify with `npm run build` and `python3 /tmp/check_game.py` from `conference-quest/`.
- The next agent should keep the scope to one NPC, one hotspot, one item, one scene transition, and one quest objective.
- If a path looks like a ghost path, confirm it is imported by the live app before changing it.

## MVP Scope

The MVP is not "all content". It is this one loop:
- Start in Scene 1 reliably.
- See the scene render and the core UI panels.
- Talk to one NPC.
- Click one hotspot and get a visible result.
- Move to at least one other scene.
- Complete one tiny quest or objective.
- Reach one clear end state or success message.

## Task List

### 1. Lock the start flow
- [ ] Confirm a hard refresh always lands in Hotel Lobby.
- [ ] Confirm the loading screen disappears consistently.
- [ ] Confirm the first scene renders on initial load.

### 2. Make one dialogue path complete
- [ ] Pick one NPC for the MVP path.
- [ ] Ensure opening dialogue works from the NPC button.
- [ ] Ensure at least one choice advances dialogue.
- [ ] Ensure dialogue can close cleanly.

### 3. Make one hotspot meaningful
- [ ] Pick one hotspot in Scene 1.
- [ ] Make clicking it do one obvious thing.
- [ ] Avoid vague alerts unless that is the simplest stable result.

### 4. Make one item matter
- [ ] Add or reveal one item through the MVP loop.
- [ ] Show the item in inventory.
- [ ] Use the item in at least one interaction or gate.

### 5. Make one scene transition work end to end
- [ ] Transition from Scene 1 to one second scene.
- [ ] Confirm the canvas updates after navigation.
- [ ] Confirm the UI reflects the new scene.

### 6. Make one quest finishable
- [ ] Start one simple quest.
- [ ] Complete one objective.
- [ ] Show a clear completion result.

### 7. Add a smoke test checklist
- [ ] Build passes.
- [ ] Game loads.
- [ ] Dialogue opens.
- [ ] Hotspot interaction works.
- [ ] Scene navigation works.
- [ ] One quest can complete.

## Out of Scope for MVP

- Architecture refactors.
- New systems.
- More scenes beyond what is needed for the playable loop.
- Rich save/load behavior.
- Complex UI polish.
- Multiple endings.
- Deep robustness work.

## Suggested Order

If I were doing this next, I would do it in this order:
1. Confirm the start scene.
2. Choose the one NPC for the MVP path.
3. Choose the one hotspot for the MVP path.
4. Connect one item to that path.
5. Make one scene transition.
6. Close the loop with one quest completion.
7. Run a manual smoke test.

## Definition of Done

The MVP is done when a fresh player can:
- load the game,
- interact with one NPC,
- trigger one hotspot,
- move to another scene,
- and complete one small objective without hitting a blocker.
