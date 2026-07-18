import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import WeightBar from '../utils/WeightBar';

const PAGE_SIZE = 30;
// The redesigned layout always presents a 5x5 (25 slot) grid per the reference.
const VISIBLE_SLOTS = 25;

interface GridProps {
  inventory: Inventory;
  // 'player' = left grid (branded header lives elsewhere), 'secondary' = right grid (shows its own compact header)
  variant: 'player' | 'secondary';
}

const InventoryGrid: React.FC<GridProps> = ({ inventory, variant }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  // Always render at least the 5x5 grid; larger inventories still page in extra rows below.
  const sliceCount = Math.max(VISIBLE_SLOTS, (page + 1) * PAGE_SIZE);
  const percent = inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0;

  return (
    <div className="ox-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      {variant === 'secondary' && (
        <div className="ox-secondary-header">
          <div className="ox-secondary-header-top">
            <p className="ox-secondary-label">{inventory.label || 'Container'}</p>
            {inventory.maxWeight !== undefined && (
              <p className="ox-secondary-weight">
                {weight / 1000} / {inventory.maxWeight / 1000} kg
              </p>
            )}
          </div>
          {inventory.maxWeight !== undefined && <WeightBar percent={percent} />}
        </div>
      )}
      <div className={`ox-grid ox-grid-${variant}`} ref={containerRef}>
        {inventory.items.slice(0, sliceCount).map((item, index) => (
          <InventorySlot
            key={`${inventory.type}-${inventory.id}-${item.slot}`}
            item={item}
            ref={index === sliceCount - 1 ? ref : null}
            inventoryType={inventory.type}
            inventoryGroups={inventory.groups}
            inventoryId={inventory.id}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;
