import { useOverlay } from '@/state/OverlayContext';
import { Overlay } from './Overlay';
import styles from './EstateModal.module.css';

/**
 * The one modal system for the Estate — replaces Estate 1.0's 9
 * hand-written open/close pairs. Shell mechanics (backdrop, Escape,
 * scroll lock, focus) live in Overlay; this just supplies the
 * title/body layout for a single-content dialog.
 */
export function EstateModal() {
  const { modal, closeModal } = useOverlay();

  return (
    <Overlay open={!!modal} onClose={closeModal} ariaLabel={modal?.title ?? 'Dialog'} size="modal">
      {modal && (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>{modal.title}</h2>
            <button className={styles.close} onClick={closeModal} aria-label="Close">
              &times;
            </button>
          </div>
          <div className={styles.body}>{modal.body}</div>
        </>
      )}
    </Overlay>
  );
}
