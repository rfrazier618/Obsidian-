import { useMemo } from 'react';
import { useEstateNavigation } from '@/state/useEstateNavigation';
import type { Destination } from '@/registry/types';
import styles from './EstateExplorer.module.css';

interface EstateExplorerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "Show me this world." District → Wing → Destination, generated
 * entirely from Registry entries with explorerVisibility: true. This
 * replaces Estate 1.0's hand-maintained 33-room grid — coverage is a
 * property of the data now, not something that has to be remembered
 * every time a new room ships.
 */
export function EstateExplorer({ open, onClose }: EstateExplorerProps) {
  const { registry, navigateTo } = useEstateNavigation();

  const grouped = useMemo(() => {
    const eligible = registry.filter((d) => d.explorerVisibility && d.status === 'live');
    const byDistrict = new Map<string, Map<string, Destination[]>>();
    for (const d of eligible) {
      const wingKey = d.wing ?? '—';
      if (!byDistrict.has(d.district)) byDistrict.set(d.district, new Map());
      const wings = byDistrict.get(d.district)!;
      if (!wings.has(wingKey)) wings.set(wingKey, []);
      wings.get(wingKey)!.push(d);
    }
    return byDistrict;
  }, [registry]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Estate Explorer" onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Estate Explorer</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        {[...grouped.entries()].map(([district, wings]) => (
          <div key={district} className={styles.districtBlock}>
            <h3 className={styles.districtLabel}>District {district}</h3>
            {[...wings.entries()].map(([wing, destinations]) => (
              <div key={wing} className={styles.wingBlock}>
                {wing !== '—' && <span className={styles.wingLabel}>{wing}</span>}
                <div className={styles.grid}>
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      className={styles.card}
                      onClick={() => {
                        navigateTo(d.id);
                        onClose();
                      }}
                    >
                      {d.displayName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
