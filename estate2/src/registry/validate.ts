import type { Destination, DiscoveryVerdict } from './types';

/**
 * Computes whether every live destination has a valid discovery path —
 * the acceptance test from the Architecture Specification, §08
 * "Registry integrity". This is deliberately a pure function over the
 * Registry, not a stored field: discovery path is exactly the kind of
 * fact that drifted four independent ways in Estate 1.0 because it was
 * hand-maintained in parallel with the data describing it.
 *
 * Reachable means: flagged for Global Nav, flagged for Explorer, OR
 * reachable by a contextual hotspot chain originating from any
 * already-reachable, non-secret destination. status:'secret'
 * destinations are exempt by design, but the exemption is explicit —
 * see the secretTrigger requirement below.
 */
export function computeDiscoveryVerdicts(registry: Destination[]): DiscoveryVerdict[] {
  const byId = new Map(registry.map((d) => [d.id, d]));
  const verdicts = new Map<string, DiscoveryVerdict>();

  const reachableSeed = registry.filter(
    (d) => d.status === 'live' && d.route && (d.globalNavVisibility || d.explorerVisibility)
  );

  for (const d of reachableSeed) {
    const via: DiscoveryVerdict['via'] = [];
    if (d.globalNavVisibility) via.push('global-nav');
    if (d.explorerVisibility) via.push('explorer');
    verdicts.set(d.id, { id: d.id, reachable: true, via });
  }

  // Propagate reachability along canon-derived adjacency (contextual nav).
  let changed = true;
  while (changed) {
    changed = false;
    for (const d of registry) {
      if (d.status !== 'live') continue;
      const already = verdicts.get(d.id);
      if (already?.reachable) continue;
      const reachableSource = d.adjacentDestinations
        .map((id) => byId.get(id))
        .find((source) => source && verdicts.get(source.id)?.reachable);
      if (reachableSource) {
        const existing = verdicts.get(d.id);
        verdicts.set(d.id, {
          id: d.id,
          reachable: true,
          via: [...(existing?.via ?? []), 'contextual'],
        });
        changed = true;
      }
    }
  }

  return registry.map((d) => {
    if (d.status === 'secret') {
      return {
        id: d.id,
        reachable: true,
        via: ['secret-exempt'],
        reason: d.secretTrigger
          ? `Exempt — secret, trigger declared: ${d.secretTrigger}`
          : 'EXEMPT WITHOUT A DECLARED TRIGGER — this should fail review',
      };
    }
    if (d.status !== 'live') {
      return { id: d.id, reachable: true, via: [], reason: `status:${d.status}, not evaluated` };
    }
    if (!d.route) {
      return {
        id: d.id,
        reachable: true,
        via: [],
        reason: 'No route — registered for canon/Directory completeness, never its own navigable page.',
      };
    }
    const verdict = verdicts.get(d.id);
    if (verdict) return verdict;
    return {
      id: d.id,
      reachable: false,
      via: [],
      reason: 'No Global Nav, Explorer, or contextual chain reaches this destination.',
    };
  });
}

/** Acceptance test: every live destination has a valid discovery path. */
export function assertNoUnreachableLiveDestinations(registry: Destination[]): string[] {
  return computeDiscoveryVerdicts(registry)
    .filter((v) => !v.reachable)
    .map((v) => v.id);
}

/** Acceptance test: every secret destination declares its trigger explicitly. */
export function assertSecretsHaveDeclaredTriggers(registry: Destination[]): string[] {
  return registry.filter((d) => d.status === 'secret' && !d.secretTrigger).map((d) => d.id);
}

/** Acceptance test: no duplicate ids. */
export function assertNoDuplicateIds(registry: Destination[]): string[] {
  const seen = new Map<string, number>();
  for (const d of registry) seen.set(d.id, (seen.get(d.id) ?? 0) + 1);
  return [...seen.entries()].filter(([, count]) => count > 1).map(([id]) => id);
}
