import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { onDrop } from '../../dnd/onDrop';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import UsefulControls from './UsefulControls';

const formatAmount = (n: number) => (n > 0 ? n.toLocaleString('en-US') : '0');
const digitsOnly = (s: string) => s.replace(/\D/g, '');
const countDigitsBefore = (s: string, index: number) => digitsOnly(s.substring(0, index)).length;

type IconName = 'use' | 'give' | 'drop' | 'info' | 'settings' | 'close';

const ActionIcon: React.FC<{ name: IconName }> = ({ name }) => {
  const p = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'use':
      return (
        <svg {...p}>
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V13c0 4-2 7-6 7-3 0-4-1-6-4l-2-3a1.6 1.6 0 0 1 2.6-1.8L9 13" />
        </svg>
      );
    case 'give':
      return (
        <svg {...p}>
          <path d="M4 12h11" />
          <path d="M12 8l4 4-4 4" />
          <path d="M18 5v14" />
        </svg>
      );
    case 'drop':
      return (
        <svg {...p}>
          <path d="M12 4v10" />
          <path d="M8 11l4 4 4-4" />
          <path d="M5 19h14" />
        </svg>
      );
    case 'info':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 2.4a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.4 2.4h5l.4-2.4a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.6c.07-.33.1-.66.1-1z" />
        </svg>
      );
    case 'close':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      );
  }
};

const ActionBar: React.FC = () => {
  const [infoVisible, setInfoVisible] = useState(false);

  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(formatAmount(itemAmount));
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);

  const commitValue = (raw: string, cursorIndex: number) => {
    const digitsBefore = countDigitsBefore(raw, cursorIndex);
    const num = parseInt(digitsOnly(raw), 10) || 0;

    setValue(formatAmount(num));
    dispatch(setItemAmount(num));
    cursorRef.current = digitsBefore;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    commitValue(event.target.value, event.target.selectionStart ?? 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    const pos = el.selectionStart ?? 0;

    if (pos !== el.selectionEnd) return;

    if (event.key === 'Backspace' && el.value[pos - 1] === ',') {
      event.preventDefault();
      commitValue(el.value.slice(0, pos - 2) + el.value.slice(pos), pos - 2);
    } else if (event.key === 'Delete' && el.value[pos] === ',') {
      event.preventDefault();
      commitValue(el.value.slice(0, pos) + el.value.slice(pos + 2), pos);
    }
  };

  useEffect(() => {
    if (!inputRef.current || cursorRef.current === null) return;
    let newPos = 0;
    let count = 0;

    for (let i = 0; i < value.length && count < cursorRef.current; i++) {
      if (/\d/.test(value[i])) count++;
      newPos++;
    }

    inputRef.current.setSelectionRange(newPos, newPos);
    cursorRef.current = null;
  }, [value]);

  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const [{ isOver: isOverDrop }, dropTarget] = useDrop<DragSource, void, { isOver: boolean }>(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    drop: (source) => {
      source.inventory === 'player' && onDrop({ item: source.item, inventory: 'player' });
    },
  }));

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <div className="ox-action-bar">
        <div className="ox-action-amount">
          <span className="ox-action-amount-label">QTY</span>
          <input
            className="ox-action-amount-input"
            type="text"
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Item amount"
          />
        </div>
        <button className="ox-action" ref={(el) => use(el)}>
          <ActionIcon name="use" />
          <span>{Locale.ui_use || 'Use'}</span>
        </button>
        <button className="ox-action" ref={(el) => give(el)}>
          <ActionIcon name="give" />
          <span>{Locale.ui_give || 'Give'}</span>
        </button>
        <button className={`ox-action${isOverDrop ? ' ox-action-active' : ''}`} ref={(el) => dropTarget(el)}>
          <ActionIcon name="drop" />
          <span>{Locale.ui_drop || 'Drop'}</span>
        </button>
        <button className="ox-action" onClick={() => setInfoVisible(true)}>
          <ActionIcon name="info" />
          <span>Info</span>
        </button>
        <button className="ox-action" onClick={() => fetchNui('openSettings')}>
          <ActionIcon name="settings" />
          <span>Settings</span>
        </button>
        <button className="ox-action ox-action-close" onClick={() => fetchNui('exit')}>
          <ActionIcon name="close" />
          <span>{Locale.ui_close || 'Close'}</span>
        </button>
      </div>
    </>
  );
};

export default ActionBar;
