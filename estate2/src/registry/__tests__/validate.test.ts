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
      backTarget: null,
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

  it('resolves contextual-chain reachability for room-b (explorer + hotspot both apply)', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const roomB = verdicts.find((v) => v.id === 'room-b');
    expect(roomB?.reachable).toBe(true);
    expect(roomB?.via).toContain('explorer');
  });

  it('resolves room-c as reachable ONLY via the contextual chain from room-b (no Explorer, no Global Nav)', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const roomC = verdicts.find((v) => v.id === 'room-c');
    expect(roomC?.reachable).toBe(true);
    expect(roomC?.via).toEqual(['contextual']);
  });

  it('does NOT count a status:"planned" destination as reachable/live for graph purposes', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const roomD = verdicts.find((v) => v.id === 'room-d');
    // planned destinations are reported but explicitly not evaluated as live
    expect(roomD?.reason).toContain('status:planned');
  });

  it('exempts declared secrets without requiring a discovery path', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const secret = verdicts.find((v) => v.id === 'fixture-secret');
    expect(secret?.reachable).toBe(true);
    expect(secret?.via).toEqual(['secret-exempt']);
  });
});
