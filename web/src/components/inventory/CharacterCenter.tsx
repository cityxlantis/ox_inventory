import React from 'react';
import ClothingEquipment from './ClothingEquipment';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

// Keeps the in-game ped fully visible in the middle. We only render the two
// vertical clothing columns flanking the character — no artificial render is drawn.
const CharacterCenter: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <div className="ox-center">
      <ClothingEquipment side="left" inventory={leftInventory} />
      <div className="ox-ped-space" aria-hidden />
      <ClothingEquipment side="right" inventory={leftInventory} />
    </div>
  );
};

export default CharacterCenter;
