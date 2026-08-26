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
 * Three states per row, matching the existing D2 behavior the owner
 * asked to preserve:
 *  - current destination        → "You are here", never a button
 *  - status:'live' + directoryVisibility → a real, clickable destination
 *  - anything else (status:'planned', or directoryVisibility:false
 *    entries that still belong in the listing for canon completeness)
 *    → visible as plain text with an explicit "not yet built" label,
 *      never rendered as an interactive control
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
              const isNavigable = !isCurrent && d.status === 'live';
              return (
                <li key={d.id} className={styles.row}>
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
                  {isCurrent && <span className={styles.tag}>You are here</span>}
                  {!isCurrent && d.status !== 'live' && <span className={styles.tagDim}>Not yet built</span>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </Overlay>
  );
}
