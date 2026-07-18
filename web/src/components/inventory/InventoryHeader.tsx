import React, { useMemo } from 'react';
import { Inventory } from '../../typings';
import { getTotalWeight } from '../../helpers';
import WeightBar from '../utils/WeightBar';

interface HeaderProps {
  inventory: Inventory;
}

// Branded header that sits above the player (left) inventory grid.
// Purely presentational; weight is derived from the same helper used elsewhere.
const InventoryHeader: React.FC<HeaderProps> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );

  const percent = inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0;

  return (
    <div className="ox-header">
      <div className="ox-brand">
        <span className="ox-brand-mark" />
        <div className="ox-brand-text">
          <p className="ox-brand-title">OXLYN ROLEPLAY</p>
          <p className="ox-brand-sub">Premium Roleplay Experience</p>
        </div>
      </div>

      <div className="ox-player">
        <div className="ox-player-avatar" aria-hidden />
        <div className="ox-player-info">
          <p className="ox-player-name">{inventory.label || 'Player'}</p>
          <div className="ox-player-balances">
            <span className="ox-balance ox-balance-cash">
              <span className="ox-balance-icon">$</span>
              {inventory.money?.cash?.toLocaleString('en-US') ?? '0'}
            </span>
            <span className="ox-balance ox-balance-bank">
              <span className="ox-balance-icon ox-balance-icon-bank" />
              {inventory.money?.bank?.toLocaleString('en-US') ?? '0'}
            </span>
          </div>
        </div>
      </div>

      <div className="ox-pockets">
        <div className="ox-pockets-title-row">
          <span className="ox-pockets-badge">{inventory.slots ? Math.ceil(inventory.slots / 25) : 1}</span>
          <div>
            <p className="ox-pockets-title">POCKETS</p>
            <p className="ox-pockets-sub">Manage your portable items</p>
          </div>
        </div>
        <div className="ox-weight-row">
          {inventory.maxWeight !== undefined && (
            <p className="ox-weight-text">
              {weight / 1000} / {inventory.maxWeight / 1000} kg
            </p>
          )}
          <span className="ox-weight-percent">{Math.round(percent)}%</span>
        </div>
        <WeightBar percent={percent} />
      </div>
    </div>
  );
};

export default InventoryHeader;
