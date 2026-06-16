import { useGameContext } from '../../GameContext';
import { useState } from 'react';

export function SettingsUI() {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings } = useGameContext();
  const textSpeed = settings?.textSpeed ?? 30;

  return (
    <>
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Settings"
      >
        ⚙
      </button>
      {open && (
        <dialog className="settings-panel" open aria-label="Settings">
          <div className="settings-content">
            <h2>Settings</h2>
            <label>
              <span>Text Speed: {textSpeed}ms</span>
              <input
                type="range"
                min="10"
                max="80"
                value={textSpeed}
                onChange={(e) => updateSettings({ textSpeed: Number(e.target.value) })}
              />
            </label>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
