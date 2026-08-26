import { describe, it, expect } from 'vitest';
import { REGISTRY } from '../data';
import {
  computeDiscoveryVerdicts,
  assertNoUnreachableLiveDestinations,
  assertSecretsHaveDeclaredTriggers,
  assertNoDuplicateIds,
} from '../validate';
import type { Destination } from '../types';

// These four are the literal §08 "Registry integrity" acceptance tests
// from the Architecture Specification, run against real registry data
// rather than left as aspirational prose.

describe('Registry integrity acceptance tests', () => {
  it('has no unreachable live destinations', () => {
    expect(assertNoUnreachableLiveDestinations(REGISTRY)).toEqual([]);
  });

  it('declares an explicit trigger for every secret destination', () => {
    expect(assertSecretsHaveDeclaredTriggers(REGISTRY)).toEqual([]);
  });

  it('has no duplicate destination ids', () => {
    expect(assertNoDuplicateIds(REGISTRY)).toEqual([]);
  });

  it('flags a destination with zero inbound path as unreachable (regression guard)', () => {
    const orphan: Destination = {
      id: 'test-orphan',
      canonicalName: 'Test Orphan Room',
      displayName: 'Test Orphan Room',
      district: 'I',
      wing: null,
      route: '/test-orphan',
      type: 'room',
      status: 'live',
      parent: null,
      adjacentDestinations: [],
      explorerVisibility: false,
      globalNavVisibility: false,
      directoryVisibility: false,
      floorPlanRef: null,
      backgroundAsset: null,
      audioProfile: null,
      capabilities: [],
      hotspots: [],
      secretTrigger: null,
    };
    const withOrphan = [...REGISTRY, orphan];
    expect(assertNoUnreachableLiveDestinations(withOrphan)).toContain('test-orphan');
  });

  it('resolves contextual-chain reachability (a room only reachable via another live room)', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const annex = verdicts.find((v) => v.id === 'dummy-room-annex');
    expect(annex?.reachable).toBe(true);
    expect(annex?.via).toContain('explorer');
  });

  it('exempts declared secrets without requiring a discovery path', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const secret = verdicts.find((v) => v.id === 'dummy-secret');
    expect(secret?.reachable).toBe(true);
    expect(secret?.via).toEqual(['secret-exempt']);
  });
});
