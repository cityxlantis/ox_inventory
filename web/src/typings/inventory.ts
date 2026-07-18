import { Slot } from './slot';

export enum InventoryType {
  PLAYER = 'player',
  SHOP = 'shop',
  CONTAINER = 'container',
  CRAFTING = 'crafting',
}

export type Inventory = {
  id: string;
  type: string;
  slots: number;
  items: Slot[];
  maxWeight?: number;
  label?: string;
  groups?: Record<string, number>;
  // Optional presentation-only fields consumed by the redesigned header/clothing UI.
  // These are ignored by all existing reducers and never mutate inventory state.
  money?: { cash?: number; bank?: number };
  clothing?: Record<string, ClothingSlotData>;
};

export type ClothingSlotData = {
  label?: string;
  image?: string;
  drawable?: number;
  count?: number;
  equipped?: boolean;
};
