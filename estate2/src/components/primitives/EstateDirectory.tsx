import { useMemo } from 'react';
import type { District, Destination } from '@/registry/types';
import { REGISTRY } from '@/registry/data';
import { Overlay } from './Overlay';
import styles from './EstateDirectory.module.css';

interface EstateDirectoryProps {
  open: boolean;
  onClose: () => void;
  district: District;
  currentId: string;
  onNavigate: (id: string) => void;
}

/**
 * The direct replacement for District II's read-only directory panel —
 * the audit's clearest "looks like navigation, isn't" finding. Every
 * row comes from the Registry; nothing here is a second dataset.
 *
 * Four states per row:
 *  - current destination                      → "You are here", never a button
 *  - status:'live', type room/hub              → a real, clickable destination
 *  - status:'live', type overlay/secret        → "Reference only" — it exists
 *    and functions (e.g. a threshold gate), but was never its own room
 *  - status:'planned'                          → "Not yet built"
 * Only the second state is ever rendered as a button.
 */
export function EstateDirectory({ open, onClose, district, currentId, onNavigate }: EstateDirectoryProps) {
  const rows = useMemo(() => {
    const inDistrict = REGISTRY.filter((d) => d.district === district && d.directoryVisibility);
    const byWing = new Map<string, Destination[]>();
    for (const d of inDistrict) {
      const key = d.wing ?? '—';
      if (!byWing.has(key)) byWing.set(key, []);
      byWing.get(key)!.push(d);
    }
    return byWing;
  }, [district]);

  return (
    <Overlay open={open} onClose={onClose} ariaLabel={`District ${district} Directory`} size="wide">
      <div className={styles.header}>
        <h2 className={styles.title}>District {district} Directory</h2>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>
      {[...rows.entries()].map(([wing, destinations]) => (
        <div key={wing} className={styles.wingBlock}>
          {wing !== '—' && <span className={styles.wingLabel}>{wing}</span>}
          <ul className={styles.list}>
            {destinations.map((d) => {
              const isCurrent = d.id === currentId;
              const isRoom = d.type === 'room' || d.type === 'hub';
              const isNavigable = !isCurrent && d.status === 'live' && isRoom;
              const tag = isCurrent
                ? 'You are here'
                : d.status === 'planned'
                  ? 'Not yet built'
                  : d.status === 'live' && !isRoom
                    ? 'Reference only'
                    : null;
              return (
                <li key={d.id} className={styles.row}>
                  {d.reference && <span className={styles.num}>{d.reference}</span>}
                  {isNavigable ? (
                    <button
                      className={styles.rowNavigable}
                      onClick={() => {
                        onNavigate(d.id);
                        onClose();
                      }}
                    >
                      {d.canonicalName}
                    </button>
                  ) : (
                    <span className={isCurrent ? styles.rowCurrent : styles.rowUnavailable}>
                      {d.canonicalName}
                    </span>
                  )}
                  {tag && <span className={isCurrent ? styles.tag : styles.tagDim}>{tag}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </Overlay>
  );
}
