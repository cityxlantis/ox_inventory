import InventoryGrid from './InventoryGrid';
import InventoryHeader from './InventoryHeader';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <div className="ox-left-panel">
      <InventoryHeader inventory={leftInventory} />
      <InventoryGrid inventory={leftInventory} variant="player" />
    </div>
  );
};

export default LeftInventory;
