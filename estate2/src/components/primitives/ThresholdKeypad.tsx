import { useState } from 'react';
import type { ThresholdConfig } from '@/registry/types';
import { Overlay } from './Overlay';
import styles from './ThresholdKeypad.module.css';

interface ThresholdKeypadProps {
  open: boolean;
  onClose: () => void;
  config: ThresholdConfig;
  onComplete: (targetId: string) => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'enter'];

/**
 * A faithful port of II-110's access-code keypad: a real, functioning
 * interaction — any 4-digit code is accepted, which is the honest
 * behavior, not a placeholder for a security system that was never
 * built. Admission state (the entered digits, the status message) is
 * owned entirely by this component, not by RoomScene or the room's
 * data — a genuine capability/state concern, encapsulated the way the
 * owner asked, rather than a `dtCode` global living next to fifty
 * unrelated variables the way the legacy version did.
 *
 * Direct-link/reload rule, stated explicitly per the migration brief:
 * there is no persisted admission state. A reload always re-presents an
 * empty keypad, and reaching Control Room by URL directly is always
 * allowed — there was never a real gate to bypass, so there's nothing
 * to accidentally lock a visitor out of either.
 */
export function ThresholdKeypad({ open, onClose, config, onComplete }: ThresholdKeypadProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('Enter access code');

  const reset = () => {
    setCode('');
    setStatus('Enter access code');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const press = (k: string) => {
    if (k === 'clear') {
      setCode('');
      setStatus('Enter access code');
      return;
    }
    if (k === 'enter') {
      if (code.length < 4) {
        setStatus('Code must be 4 digits');
        return;
      }
      setStatus('Access granted.');
      window.setTimeout(() => {
        reset();
        onClose();
        onComplete(config.targetId);
      }, 900);
      return;
    }
    if (code.length < 4) {
      const next = code + k;
      setCode(next);
      setStatus(next.length === 4 ? 'Press Enter' : status);
    }
  };

  return (
    <Overlay open={open} onClose={handleClose} ariaLabel={config.eyebrow} size="modal">
      <p className={styles.eyebrow}>{config.eyebrow}</p>
      <div className={styles.logo}>DEPMG</div>
      <p className={styles.motto}>{config.motto}</p>
      <div className={styles.display}>{code.padEnd(4, '·').split('').join(' ')}</div>
      <div className={styles.keypad}>
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            className={k === 'enter' ? styles.keyEnter : k === 'clear' ? styles.keyClear : styles.key}
            onClick={() => press(k)}
          >
            {k === 'clear' ? 'Clear' : k === 'enter' ? 'Enter' : k}
          </button>
        ))}
      </div>
      <p className={styles.status}>{status}</p>
    </Overlay>
  );
}
