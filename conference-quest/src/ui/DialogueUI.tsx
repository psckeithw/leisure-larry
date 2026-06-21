
export function DialogueUI({ node, onChoice, onClose, speakerName }: { node: any; onChoice: (choiceId: string) => void; onClose: () => void; speakerName?: string }) {
  const displayName = speakerName ?? node?.speaker ?? 'NPC';
  const text = node?.text ?? '';
  const choices = node?.choices ?? [];

  return (
    <div className="dialogue-overlay" role="dialog" aria-labelledby="dialogue-name">
      <div className="dialogue-panel">
        <header className="dialogue-header">
          <h2 id="dialogue-name">{speakerName}</h2>
          <button type="button" className="dialogue-close" onClick={onClose}>×</button>
        </header>
        <article id="dialogue-text" className="dialogue-text" aria-live="polite">
          {text}
        </article>
        <div className="dialogue-actions">
          {choices.map((choice: any, idx: number) => (
            <button
              key={choice.id}
              type="button"
              className="dialogue-choice"
              onClick={() => onChoice(choice.id)}
            >
              {idx + 1}. {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
