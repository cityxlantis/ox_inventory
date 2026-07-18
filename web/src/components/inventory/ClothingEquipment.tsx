import React from 'react';
import { ClothingSlotData, Inventory } from '../../typings';

export type ClothingKey =
  | 'hat'
  | 'mask'
  | 'glasses'
  | 'chain'
  | 'watch'
  | 'jacket'
  | 'shirt'
  | 'armor'
  | 'bag'
  | 'pants'
  | 'shoes';

interface ClothingSlotProps {
  slotKey: ClothingKey;
  label: string;
  data?: ClothingSlotData;
}

// Minimal line icons for empty clothing states. Kept as small inline SVGs so no
// extra assets/deps are needed and they inherit the accent color via currentColor.
const EmptyIcon: React.FC<{ slotKey: ClothingKey }> = ({ slotKey }) => {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (slotKey) {
    case 'hat':
      return (
        <svg {...common}>
          <path d="M4 16c2-1 12-1 16 0" />
          <path d="M8 16l1-8a3 3 0 0 1 6 0l1 8" />
        </svg>
      );
    case 'mask':
      return (
        <svg {...common}>
          <path d="M4 8c0-2 3-3 8-3s8 1 8 3v3c0 4-4 8-8 8s-8-4-8-8z" />
          <circle cx="9" cy="11" r="1" />
          <circle cx="15" cy="11" r="1" />
        </svg>
      );
    case 'glasses':
      return (
        <svg {...common}>
          <circle cx="7" cy="13" r="3" />
          <circle cx="17" cy="13" r="3" />
          <path d="M10 13h4M3 11l2-2M21 11l-2-2" />
        </svg>
      );
    case 'chain':
      return (
        <svg {...common}>
          <path d="M9 8a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0v-1" />
          <path d="M15 16a3 3 0 0 0 3-3v-1a3 3 0 0 0-6 0v1" />
        </svg>
      );
    case 'watch':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M9 8l1-3h4l1 3M9 16l1 3h4l1-3" />
        </svg>
      );
    case 'jacket':
      return (
        <svg {...common}>
          <path d="M8 4l4 3 4-3 4 3-2 4v9H6v-9L4 7z" />
          <path d="M12 7v13" />
        </svg>
      );
    case 'shirt':
      return (
        <svg {...common}>
          <path d="M8 4l4 3 4-3 4 3-2 3v10H6V10L4 7z" />
        </svg>
      );
    case 'armor':
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4-3 8-7 10-4-2-7-6-7-10V6z" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...common}>
          <path d="M6 9h12v10H6z" />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case 'pants':
      return (
        <svg {...common}>
          <path d="M7 4h10l-1 16h-3l-1-9-1 9H7z" />
        </svg>
      );
    case 'shoes':
      return (
        <svg {...common}>
          <path d="M4 8h4l2 4 8 2v4H4z" />
        </svg>
      );
    default:
      return null;
  }
};

const ClothingSlot: React.FC<ClothingSlotProps> = ({ slotKey, label, data }) => {
  const equipped = !!data && (data.equipped || data.image || data.drawable !== undefined);

  return (
    <div className={`ox-clothing-slot${equipped ? ' ox-clothing-equipped' : ''}`}>
      <div className="ox-clothing-card">
        {equipped && data?.image ? (
          <div className="ox-clothing-image" style={{ backgroundImage: `url(${data.image})` }} />
        ) : (
          <div className="ox-clothing-empty">
            <EmptyIcon slotKey={slotKey} />
          </div>
        )}
        {data?.count !== undefined && <span className="ox-clothing-badge">{data.count}</span>}
        {equipped && <span className="ox-clothing-indicator" aria-hidden />}
      </div>
      <p className="ox-clothing-label">{label}</p>
    </div>
  );
};

const LEFT_SLOTS: { key: ClothingKey; label: string }[] = [
  { key: 'hat', label: 'Hat' },
  { key: 'mask', label: 'Mask' },
  { key: 'glasses', label: 'Glasses' },
  { key: 'chain', label: 'Chain' },
  { key: 'watch', label: 'Watch' },
];

const RIGHT_SLOTS: { key: ClothingKey; label: string }[] = [
  { key: 'jacket', label: 'Jacket' },
  { key: 'shirt', label: 'Shirt' },
  { key: 'armor', label: 'Armor' },
  { key: 'bag', label: 'Bag' },
  { key: 'pants', label: 'Pants' },
  { key: 'shoes', label: 'Shoes' },
];

const ClothingEquipment: React.FC<{ side: 'left' | 'right'; inventory: Inventory }> = ({ side, inventory }) => {
  const slots = side === 'left' ? LEFT_SLOTS : RIGHT_SLOTS;
  const clothing = inventory.clothing || {};

  return (
    <div className={`ox-clothing-column ox-clothing-${side}`}>
      {slots.map((slot) => (
        <ClothingSlot key={slot.key} slotKey={slot.key} label={slot.label} data={clothing[slot.key]} />
      ))}
    </div>
  );
};

export default ClothingEquipment;
