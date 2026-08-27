import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';
import { computeDiscoveryVerdicts, assertNoUnreachableLiveDestinations } from '@/registry/validate';
import { REGISTRY } from '@/registry/data';

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <RootProvider>
        <App />
      </RootProvider>
    </MemoryRouter>
  );
}

describe('District II HQ branch — hub-and-spoke architectural test', () => {
  it('Reception -> HQ Corridor: the D2 Navigation hotspot is now a real navigate action, not a placeholder toast', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('D2 Navigation — Executive, Brand & Media HQ'));
    expect(screen.getByText('Executive, Brand & Media HQ')).toBeInTheDocument();
    expect(screen.getByText('II-3xx')).toBeInTheDocument();
    expect(screen.queryByText(/hasn.t migrated to Estate 2\.0/)).not.toBeInTheDocument();
  });

  it('HQ Corridor -> Screening -> back to the hub', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByTitle('Obsidian Screening Theater — II-311'));
    expect(screen.getByText('II-311')).toBeInTheDocument();
    fireEvent.click(screen.getByText('← Executive, Brand & Media HQ'));
    expect(screen.getByText('II-3xx')).toBeInTheDocument();
  });

  it('HQ Corridor -> Executive Boardroom -> back to the hub', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByTitle('Executive Suite — II-301–304'));
    expect(screen.getByText('II-303')).toBeInTheDocument();
    fireEvent.click(screen.getByText('← Executive, Brand & Media HQ'));
    expect(screen.getByText('II-3xx')).toBeInTheDocument();
  });

  it('HQ Corridor -> Brand Studios -> back to the hub', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByTitle('Brand Studios — II-305–308'));
    expect(screen.getByText('II-305–308')).toBeInTheDocument();
    fireEvent.click(screen.getByText('← Executive, Brand & Media HQ'));
    expect(screen.getByText('II-3xx')).toBeInTheDocument();
  });

  it('HQ Corridor -> Creator Suites & Lounge -> back to the hub', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByTitle('Creator Suites & Lounge — II-309–310'));
    expect(screen.getByText('II-309–310')).toBeInTheDocument();
    fireEvent.click(screen.getByText('← Executive, Brand & Media HQ'));
    expect(screen.getByText('II-3xx')).toBeInTheDocument();
  });

  it('Executive Boardroom has no lateral hotspots to the other three leaves', () => {
    renderApp('/district-ii/boardroom');
    expect(screen.getByTitle('HQ Corridor — return to the hub')).toBeInTheDocument();
    expect(document.querySelectorAll('[title*="Obsidian Screening Theater"]').length).toBe(0);
    expect(document.querySelectorAll('[title*="Brand Studios"]').length).toBe(0);
    expect(document.querySelectorAll('[title*="Creator Suites & Lounge"]').length).toBe(0);
  });

  it('Brand Studios has no lateral hotspots to the other three leaves', () => {
    renderApp('/district-ii/brand-studios');
    expect(screen.getByTitle('HQ Corridor — return to the hub')).toBeInTheDocument();
    expect(document.querySelectorAll('[title*="Obsidian Screening Theater"]').length).toBe(0);
    expect(document.querySelectorAll('[title*="Executive Suite"]').length).toBe(0);
    expect(document.querySelectorAll('[title*="Creator Suites & Lounge"]').length).toBe(0);
  });

  it('Screening has no lateral hotspots to Boardroom or Brand Studios (only its one inbound relationship from Creator Suites & Lounge)', () => {
    renderApp('/district-ii/screening');
    expect(screen.getByTitle('HQ Corridor — return to the hub')).toBeInTheDocument();
    expect(document.querySelectorAll('[title*="Executive Suite"]').length).toBe(0);
    expect(document.querySelectorAll('[title*="Brand Studios"]').length).toBe(0);
    expect(document.querySelectorAll('[title*="Creator Suites & Lounge"]').length).toBe(0);
  });

  it('THE one verified leaf-to-leaf exception: Creator Suites & Lounge links directly to Screening — preserved, not invented', () => {
    renderApp('/district-ii/creator-lounge');
    fireEvent.click(screen.getByTitle('Obsidian Screening Theater — II-311'));
    expect(screen.getByText('II-311')).toBeInTheDocument();
    // Screening's own back target stays the hub, not Creator Suites & Lounge —
    // asymmetric on purpose, matching legacy exactly.
    expect(screen.getByText('← Executive, Brand & Media HQ')).toBeInTheDocument();
    expect(document.querySelectorAll('[title*="Creator Suites & Lounge"]').length).toBe(0);
  });

  it('CEO Office, VP Office, and Small Executive Conference remain informational-only inside Boardroom, not live rooms', () => {
    renderApp('/district-ii/boardroom');
    fireEvent.click(screen.getByTitle('CEO Office — II-301'));
    expect(screen.getByText(/Not built into the Estate yet/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('VP Office — II-302'));
    expect(screen.getByText(/Not built into the Estate yet/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('Small Executive Conference — II-304'));
    expect(screen.getByText(/Not built into the Estate yet/)).toBeInTheDocument();

    const ceo = REGISTRY.find((d) => d.id === 'd2-301-ceo')!;
    expect(ceo.status).toBe('planned');
    expect(ceo.route).toBeNull();
  });

  it('the four brands remain informational thresholds inside Brand Studios, not live rooms', () => {
    renderApp('/district-ii/brand-studios');
    fireEvent.click(screen.getByTitle('Twin Scales Publishing — II-305'));
    expect(screen.getByText(/Not built into the Estate yet/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('Podcast Studio — II-308'));
    expect(screen.getByText(/Not built into the Estate yet/)).toBeInTheDocument();

    const twinScales = REGISTRY.find((d) => d.id === 'd2-305-twinscales')!;
    expect(twinScales.status).toBe('planned');
  });

  it('Creator Suites (II-309) stays informational-only; Creator Lounge (II-310) copy has no such disclaimer, matching legacy exactly', () => {
    renderApp('/district-ii/creator-lounge');
    fireEvent.click(screen.getByTitle('Creator Suites — II-309'));
    expect(screen.getByText(/Not built into the Estate yet/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('Creator Lounge — II-310'));
    expect(screen.getByText(/where ideas collide and creators build/)).toBeInTheDocument();
    expect(screen.queryByText(/Not built into the Estate yet/)).not.toBeInTheDocument();
  });

  it('Screening Theater informational thresholds: Now Screening, Theater Seating, Surround Sound, Projection & Edit Suite', () => {
    renderApp('/district-ii/screening');
    fireEvent.click(screen.getByTitle('Now Screening'));
    expect(screen.getByText(/reference-quality projection wall/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('Projection & Edit Suite'));
    const body = screen.getByRole('dialog', { name: 'Projection & Edit Suite' }).textContent!;
    expect(body).toContain('Not a separately navigable room yet.');
    expect(body).not.toMatch(/&amp;/); // the entity-rendering bug must not recur
  });

  it('no Sound Lock activation anywhere in the HQ branch', () => {
    for (const title of [
      'Obsidian Screening Theater — II-311',
      'Executive Suite — II-301–304',
      'Brand Studios — II-305–308',
      'Creator Suites & Lounge — II-309–310',
    ]) {
      cleanup();
      renderApp('/district-ii/hq-corridor');
      fireEvent.click(screen.getByTitle(title));
      expect(screen.queryByText('Passing through the Sound Lock…')).not.toBeInTheDocument();
    }
  });

  it('Directory fidelity: all 5 live HQ destinations navigable, all HQ stubs correctly "Not yet built"', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByText('Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    for (const name of [
      'Executive, Brand & Media HQ',
      'Executive Boardroom',
      'Brand Studios',
      'Creator Suites & Lounge',
      'Obsidian Screening Theater',
    ]) {
      // getByRole disambiguates the navigable row (a <button>) from the
      // wing-group <span> label above it, which for this one wing happens
      // to carry the identical text "Executive, Brand & Media HQ".
      expect(within(dir).getByRole('button', { name })).toBeInTheDocument();
    }
    for (const name of ['CEO Office', 'Twin Scales Publishing', 'Creator Suites', 'Administrative / Support Workspace']) {
      const row = within(dir).getByText(name);
      expect(row.tagName).toBe('SPAN');
      expect(within(row.closest('li')!).getByText('Not yet built')).toBeInTheDocument();
    }
  });

  it('Floor Plan markers exist for all 5 live HQ destinations', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByText('Floor Plan'));
    for (const title of [
      'Executive, Brand & Media HQ',
      'Executive Boardroom',
      'Brand Studios',
      'Creator Suites & Lounge',
      'Obsidian Screening Theater',
    ]) {
      expect(document.querySelectorAll(`[title="${title}"]`).length).toBeGreaterThan(0);
    }
  });

  it('Explorer discovery lists the HQ Corridor and all four flagship leaves', () => {
    renderApp('/');
    fireEvent.click(screen.getByText('Explore →'));
    const explorer = screen.getByRole('dialog', { name: 'Estate Explorer' });
    for (const name of [
      'Executive, Brand & Media HQ',
      'Executive Boardroom',
      'Brand Studios',
      'Creator Suites & Lounge',
      'Obsidian Screening Theater',
    ]) {
      expect(within(explorer).getByRole('button', { name })).toBeInTheDocument();
    }
  });

  it('direct-link resolves every HQ room independently', () => {
    for (const [route, ref] of [
      ['/district-ii/hq-corridor', 'II-3xx'],
      ['/district-ii/boardroom', 'II-303'],
      ['/district-ii/brand-studios', 'II-305–308'],
      ['/district-ii/creator-lounge', 'II-309–310'],
      ['/district-ii/screening', 'II-311'],
    ] as const) {
      renderApp(route);
      expect(screen.getByText(ref)).toBeInTheDocument();
    }
  });

  it('overlay focus/Escape behavior works identically in HQ rooms as in District II', () => {
    renderApp('/district-ii/boardroom');
    fireEvent.click(screen.getByTitle('CEO Office — II-301'));
    const dialog = screen.getByRole('dialog', { name: 'CEO Office' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'CEO Office' })).not.toBeInTheDocument();
  });

  it('global audio state persists across navigation into and through the HQ branch', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByTitle('Toggle ambient audio'));
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
    fireEvent.click(screen.getByTitle('Obsidian Screening Theater — II-311'));
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
  });

  it('reachability: HQ Corridor and all 4 flagship leaves are genuinely reachable via a real chain', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const byId = Object.fromEntries(verdicts.map((v) => [v.id, v]));
    for (const id of ['hq-corridor', 'boardroom', 'brand-studios', 'creator-lounge', 'screening']) {
      expect(byId[id].reachable, `${id} should be reachable`).toBe(true);
      expect(byId[id].via?.length ?? 0, `${id} should have a real via chain`).toBeGreaterThan(0);
    }
  });

  it('the acceptance test passes with the HQ branch included: no unreachable live destinations anywhere in the Registry', () => {
    const failures = assertNoUnreachableLiveDestinations(REGISTRY);
    expect(failures).toEqual([]);
  });

  it('HQ sub-room stubs remain planned and non-navigable: no route, correct status', () => {
    for (const id of [
      'd2-301-ceo', 'd2-302-vp', 'd2-304-smallconf',
      'd2-305-twinscales', 'd2-306-algorhythm', 'd2-307-omd', 'd2-308-podcast',
      'd2-309-creatorsuites', 'd2-312-admin', 'd2-313-cafe', 'd2-314-restrooms',
    ]) {
      const d = REGISTRY.find((r) => r.id === id)!;
      expect(d.status, `${id} should stay planned`).toBe('planned');
      expect(d.route, `${id} should have no route`).toBeNull();
    }
  });
});
