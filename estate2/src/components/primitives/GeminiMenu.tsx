import { useMemo, useState } from 'react';
import type { MenuItem } from '@/registry/menu';
import { getFulfillmentProfile } from '@/registry/commerce';
import { useCommerce } from '@/state/CommerceContext';
import { Overlay } from './Overlay';
import styles from './GeminiMenu.module.css';

interface GeminiMenuProps {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  /** The ordering room's own Registry id — both the cart-line tag and the
   *  FULFILLMENT_PROFILES lookup key. Gemini Main Bar and Mintaka render
   *  this exact same component with two different values here; nothing
   *  else about the component changes between them. */
  fulfillmentContext: string;
  roomLabel: string;
}

/**
 * One browse-and-order surface, reused verbatim by Gemini Main Bar and
 * Mintaka — proving the architectural requirement that ordering has no
 * per-room implementation. "Menu" (browse) and "Order at the Bar"
 * (transact) are legacy's own real distinction, but legacy renders both
 * inside the single #bar-overlay with an internal toggle, not as two
 * separate overlays — that structure is preserved here as one component
 * with a `view` switch, not two.
 */
export function GeminiMenu({ open, onClose, items, fulfillmentContext, roomLabel }: GeminiMenuProps) {
  const [view, setView] = useState<'browse' | 'order'>('browse');
  const { linesFor, addItem, removeItem, placeOrder } = useCommerce();
  const profile = getFulfillmentProfile(fulfillmentContext);
  const lines = linesFor(fulfillmentContext);
  const cartLines = lines.filter((l) => l.status === 'cart');
  const placedLines = lines.filter((l) => l.status !== 'cart');

  const grouped = useMemo(() => {
    const byCategory = new Map<string, MenuItem[]>();
    for (const item of items) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }
    return Array.from(byCategory.entries());
  }, [items]);

  const handleClose = () => {
    setView('browse');
    onClose();
  };

  return (
    <Overlay open={open} onClose={handleClose} ariaLabel={`${roomLabel} Menu`} size="wide">
      <div className={styles.header}>
        <h2 className={styles.title}>{roomLabel} Menu</h2>
        <div className={styles.headerActions}>
          {view === 'browse' ? (
            <button type="button" className={styles.orderBtn} onClick={() => setView('order')}>
              {profile ? profile.label.split(' · ')[1] ?? 'Order' : 'Order'}
              {cartLines.length > 0 && <span className={styles.badge}>{cartLines.length}</span>}
            </button>
          ) : (
            <button type="button" className={styles.orderBtn} onClick={() => setView('browse')}>
              &larr; Menu
            </button>
          )}
          <button className={styles.close} onClick={handleClose} aria-label="Close">
            &times;
          </button>
        </div>
      </div>

      {view === 'browse' && (
        <div className={styles.catalogue}>
          {grouped.map(([category, categoryItems]) => (
            <section key={category} className={styles.category}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              {categoryItems.map((item) => (
                <div key={item.id} className={styles.row}>
                  <div className={styles.rowInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemSubtitle}>{item.subtitle}</p>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addItem(fulfillmentContext, item.id, item.name)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}

      {view === 'order' && (
        <div className={styles.order}>
          {lines.length === 0 && <p className={styles.empty}>Nothing added from the menu yet.</p>}

          {cartLines.length > 0 && (
            <section>
              <h3 className={styles.categoryTitle}>In your order</h3>
              {cartLines.map((line) => (
                <div key={line.id} className={styles.orderRow}>
                  <span>
                    {line.name} &times;{line.quantity}
                  </span>
                  <button type="button" className={styles.removeBtn} onClick={() => removeItem(line.id)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className={styles.submitBtn} onClick={() => placeOrder(fulfillmentContext)}>
                Place Order
              </button>
            </section>
          )}

          {placedLines.length > 0 && (
            <section>
              <h3 className={styles.categoryTitle}>
                {profile ? profile.label : 'Order Status'}
              </h3>
              {placedLines.map((line) => (
                <div key={line.id} className={styles.orderRow}>
                  <span>
                    {line.name} &times;{line.quantity}
                  </span>
                  <span className={styles.status} aria-live="polite">
                    {line.status}
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </Overlay>
  );
}
