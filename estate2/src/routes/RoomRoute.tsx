import { useParams } from 'react-router-dom';
import { getDestination } from '@/registry/data';
import { isAdmitted } from '@/registry/admission';
import { RoomScene } from '@/components/primitives/RoomScene';
import { useEstateNavigation } from '@/state/useEstateNavigation';

/**
 * Resolves a route to a Registry destination and mounts RoomScene with
 * it. This is the whole of "content routing" — there is no per-room
 * route handler anywhere else, which is exactly what makes direct-link
 * resolution (typing a URL, or refreshing on one) work automatically
 * for every destination the Registry declares.
 *
 * `admissionRequired` is enforced here, the same chokepoint that turns
 * an unknown id into an honest "no destination" page — so a direct link
 * to a gated destination (Gemini Main Floor, District III's ordering
 * rooms) is refused identically to a hotspot that tried to skip the
 * gate, rather than each gated destination's own component remembering
 * to check.
 */
export function RoomRoute({ destinationId }: { destinationId: string }) {
  const destination = getDestination(destinationId);

  if (!destination) {
    return <NotFoundRoom hint={destinationId} />;
  }

  if (destination.admissionRequired && !isAdmitted(destination.admissionRequired)) {
    return <AdmissionRequiredRoom gateId={destination.admissionRequired} />;
  }

  return <RoomScene destination={destination} />;
}

function AdmissionRequiredRoom({ gateId }: { gateId: string }) {
  const gate = getDestination(gateId);
  const { navigateTo } = useEstateNavigation();
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--cream-dim)' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22 }}>
        This destination isn&rsquo;t open to you yet.
      </p>
      {gate && (
        <button
          type="button"
          onClick={() => navigateTo(gate.id)}
          style={{
            marginTop: 16,
            background: 'var(--panel-2)',
            border: '1px solid var(--gold-dim)',
            color: 'var(--gold)',
            padding: '10px 20px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Go to {gate.displayName}
        </button>
      )}
    </div>
  );
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
