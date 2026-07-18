import InventoryGrid from './InventoryGrid';
import InventoryHeader from './InventoryHeader';
import ActionBar from './ActionBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <div className="ox-col ox-col-left">
      <div className="ox-panel">
        <InventoryHeader inventory={leftInventory} />
        <InventoryGrid inventory={leftInventory} variant="player" />
      </div>
      <ActionBar />
    </div>
  );
};

export default LeftInventory;
