import InventoryGrid from './InventoryGrid';
import SecondaryInventoryStatus from './SecondaryInventoryStatus';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  return (
    <div className="ox-col ox-col-right">
      <div className="ox-panel">
        <InventoryGrid inventory={rightInventory} variant="secondary" />
      </div>
      <SecondaryInventoryStatus inventory={rightInventory} />
    </div>
  );
};

export default RightInventory;
