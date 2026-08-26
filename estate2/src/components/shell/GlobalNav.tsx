import { useEstateNavigation } from '@/state/useEstateNavigation';
import { useAudio } from '@/state/AudioContext';
import styles from './GlobalNav.module.css';

/**
 * "I know what I want." Persistent utility bar, populated from every
 * Registry entry flagged globalNavVisibility — adding a destination
 * here is a data change in registry/data.ts, never a markup change.
 */
export function GlobalNav({ onOpenExplorer }: { onOpenExplorer: () => void }) {
  const { registry, navigateTo, current } = useEstateNavigation();
  const { muted, toggleMuted } = useAudio();

  const entries = registry.filter((d) => d.globalNavVisibility);

  return (
    <nav className={styles.bar} aria-label="Global navigation">
      <button className={styles.brand} onClick={() => navigateTo('estate-hall')}>
        The Obsidian Estate
      </button>
      <div className={styles.links}>
        {entries.map((d) => (
          <button
            key={d.id}
            className={d.id === current?.id ? styles.linkActive : styles.link}
            onClick={() => navigateTo(d.id)}
          >
            {d.displayName}
          </button>
        ))}
        <button className={styles.link} onClick={onOpenExplorer}>
          Explore &rarr;
        </button>
      </div>
      <button className={styles.audioBtn} onClick={toggleMuted} aria-pressed={!muted} title="Toggle ambient audio">
        {muted ? '♪ off' : '♪ on'}
      </button>
    </nav>
  );
}
