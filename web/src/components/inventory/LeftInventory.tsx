import InventoryGrid from './InventoryGrid';
import InventoryHeader from './InventoryHeader';
import ActionBar from './ActionBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <div className="ox-region ox-region-left">
      <InventoryHeader inventory={leftInventory} />
      <InventoryGrid inventory={leftInventory} variant="player" />
      <ActionBar />
    </div>
  );
};

export default LeftInventory;
