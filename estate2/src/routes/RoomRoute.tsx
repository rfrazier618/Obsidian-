import { useParams } from 'react-router-dom';
import { getDestination } from '@/registry/data';
import { RoomScene } from '@/components/primitives/RoomScene';

/**
 * Resolves a route to a Registry destination and mounts RoomScene with
 * it. This is the whole of "content routing" — there is no per-room
 * route handler anywhere else, which is exactly what makes direct-link
 * resolution (typing a URL, or refreshing on one) work automatically
 * for every destination the Registry declares.
 */
export function RoomRoute({ destinationId }: { destinationId: string }) {
  const destination = getDestination(destinationId);

  if (!destination) {
    return <NotFoundRoom hint={destinationId} />;
  }

  return <RoomScene destination={destination} />;
}

/** Also used for genuinely unmatched routes, via useParams on a wildcard. */
export function UnknownRoute() {
  const params = useParams();
  return <NotFoundRoom hint={JSON.stringify(params)} />;
}

function NotFoundRoom({ hint }: { hint: string }) {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--cream-dim)' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22 }}>
        No destination matches this route.
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: 12 }}>{hint}</p>
    </div>
  );
}
