import React, { useMemo } from 'react';
import { Inventory } from '../../typings';
import { isSlotWithItem } from '../../helpers';

// Maps the ox_inventory secondary inventory type/id to a friendly title + description.
const getStatusCopy = (inventory: Inventory) => {
  const id = (inventory.id || '').toLowerCase();
  const type = (inventory.type || '').toLowerCase();

  if (type === 'shop') return { title: 'SHOP', desc: 'Drag items here to sell them.' };
  if (type === 'crafting') return { title: 'CRAFTING BENCH', desc: 'Drag ingredients to craft new items.' };
  if (id.includes('trunk')) return { title: 'THIS TRUNK IS EMPTY', desc: 'Drag items to store them in your vehicle.' };
  if (id.includes('glove')) return { title: 'GLOVEBOX IS EMPTY', desc: 'Drag items to store them in your glovebox.' };
  if (id.includes('stash')) return { title: 'THIS STASH IS EMPTY', desc: 'Drag items here to store them.' };
  if (id.includes('drop') || type === 'drop') return { title: 'THIS DROP IS EMPTY', desc: 'Drag items here to store them.' };
  if (type === 'container') return { title: 'THIS CONTAINER IS EMPTY', desc: 'Drag items here to store them.' };

  return { title: 'THIS BRIEF IS EMPTY', desc: 'Drag items to store in your vehicle.' };
};

const SecondaryInventoryStatus: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const hasItems = useMemo(() => inventory.items.some((item) => isSlotWithItem(item)), [inventory.items]);
  const copy = getStatusCopy(inventory);

  return (
    <div className="ox-secondary-status">
      <div className="ox-secondary-status-icon" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 8h16v11H4z" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="ox-secondary-status-text">
        <p className="ox-secondary-status-title">{hasItems ? inventory.label || copy.title : copy.title}</p>
        <p className="ox-secondary-status-desc">{copy.desc}</p>
      </div>
    </div>
  );
};

export default SecondaryInventoryStatus;
