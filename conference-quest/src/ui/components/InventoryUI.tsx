import { useGameContext } from '../../GameContext';

export function InventoryUI() {
  const { state } = useGameContext();
  const inventory = state.inventory;

  return (
    <aside id="inventory" className="inventory-panel" role="complementary" aria-label="Inventory">
      <h2 className="inventory-title">Inventory</h2>
      <ul className="inventory-list">
        {inventory.length === 0 && <li className="inventory-empty">Empty</li>}
        {inventory.map((itemId: string) => (
          <li key={itemId} className="inventory-item" tabIndex={0} aria-label={itemId}>
            <span className="inventory-icon">🎒</span>
            <span className="inventory-name">{itemId}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
