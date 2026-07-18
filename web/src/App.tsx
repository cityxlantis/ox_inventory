import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 25,
        label: 'Oxlyn Scriptees',
        weight: 28700,
        maxWeight: 50000,
        money: { cash: 193245, bank: 584495 },
        clothing: {
          hat: { count: 72, equipped: true },
          mask: {},
          glasses: { count: 28, equipped: true },
          chain: {},
          watch: { count: 4, equipped: true },
          jacket: { count: 0, equipped: true },
          shirt: { equipped: true },
          armor: { count: 12, equipped: true },
          bag: {},
          pants: { count: 292, equipped: true },
          shoes: { count: 72, equipped: true },
        },
        items: [
          {
            slot: 1,
            name: 'water',
            weight: 500,
            count: 15,
            metadata: { label: 'Water Bottle' },
          },
          { slot: 2, name: 'lockpick', weight: 200, count: 14, metadata: { label: 'Lockpick Set' } },
          { slot: 3, name: 'copper', weight: 100, count: 16, metadata: { label: 'Duct Tape' } },
          { slot: 4, name: 'powersaw', weight: 3000, count: 1, metadata: { label: 'SMG', durability: 100 } },
          { slot: 6, name: 'water', weight: 350, count: 2, metadata: { label: 'Swiss Arms' } },
          { slot: 7, name: 'iron', weight: 100, count: 1, metadata: { label: 'Cash' } },
          { slot: 8, name: 'copper', weight: 50, count: 249, metadata: { label: '9mm' } },
          { slot: 11, name: 'backwoods', weight: 100, count: 1, metadata: { label: 'Major Body Pain' } },
          { slot: 16, name: 'powersaw', weight: 900, count: 1, metadata: { label: 'Pistol', durability: 92 } },
        ],
      },
      rightInventory: {
        id: 'drop-1',
        type: 'drop',
        slots: 25,
        label: 'Ground Drop',
        weight: 0,
        maxWeight: 100000,
        items: [],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
