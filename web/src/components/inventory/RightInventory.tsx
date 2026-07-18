import InventoryGrid from './InventoryGrid';
import SecondaryInventoryStatus from './SecondaryInventoryStatus';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  return (
    <div className="ox-region ox-region-right">
      <InventoryGrid inventory={rightInventory} variant="secondary" />
      <SecondaryInventoryStatus inventory={rightInventory} />
    </div>
  );
};

export default RightInventory;
