import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

describe('II-200 Batch 4 (final Recording Complex batch) — Machine Room / Studio Kitchenette', () => {
  it('Machine Room renders as technical infrastructure, not a creative workspace', () => {
    renderApp('/district-ii/machine-room');
    expect(screen.getByText('II-210C')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Systems Monitoring'));
    expect(screen.getByText(/status, not sound/)).toBeInTheDocument();
    expect(screen.getByText(/A diagnostics position, not a recording workstation/)).toBeInTheDocument();
  });

  it('Machine Room preserves the conceptual, non-specific language for Power & Conditioning — no fabricated ratings/capacities', () => {
    renderApp('/district-ii/machine-room');
    fireEvent.click(screen.getByTitle('Power & Conditioning'));
    const body = screen.getByRole('dialog', { name: 'Power & Conditioning' }).textContent!;
    expect(body).toContain("Specific capacities and ratings aren't published here.");
    // No invented electrical values, model numbers, or ratings anywhere in the panel.
    expect(body).not.toMatch(/\d+\s?(kW|kVA|amp|volt|V\b|A\b)/i);
  });

  it('Machine Room preserves its existing navigation structure: only one hotspot back to Mic Vault, nothing forward-looking manufactured', () => {
    renderApp('/district-ii/machine-room');
    expect(screen.getByTitle('Mic Vault — II-210B')).toBeInTheDocument();
    expect(screen.queryByTitle(/Kitchenette/)).not.toBeInTheDocument();
  });

  it('Studio Kitchenette renders with the Kitchenette as the primary focus, correctly spelled in all interactive/canonical content', () => {
    renderApp('/district-ii/kitchenette');
    expect(screen.getByText('II-211')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Kitchenette'));
    const body = screen.getByRole('dialog', { name: 'Kitchenette' }).textContent!;
    expect(body).toMatch(/kitchenette/i);
    expect(body).not.toMatch(/kicthenette/i); // the baked-render typo must NOT be reproduced in interactive content
  });

  it('Guest Seating preserves its "reset space, not a second lounge" distinction from Artist Lounge', () => {
    renderApp('/district-ii/kitchenette');
    fireEvent.click(screen.getByTitle('Guest Seating'));
    expect(screen.getByText(/A reset space, not a second lounge/)).toBeInTheDocument();
  });

  it('Restrooms render as a plain reference/threshold panel, not an invented room experience', () => {
    renderApp('/district-ii/kitchenette');
    fireEvent.click(screen.getByTitle('Restrooms'));
    const body = screen.getByRole('dialog', { name: 'Restrooms' }).textContent!;
    expect(body).toMatch(/Restroom facilities for artists, engineers, producers and guests/);
  });

  it('Artist Lounge -> II-211 cross-reference is carried forward correctly: names II-211, correctly spelled, distinguishes from the Lounge\'s own hospitality element', () => {
    renderApp('/district-ii/artist-lounge');
    fireEvent.click(screen.getByTitle('Hospitality'));
    const body = screen.getByRole('dialog', { name: 'Hospitality' }).textContent!;
    expect(body).toContain('II-211 Studio Kitchenette');
    expect(body).not.toMatch(/kicthenette/i);
  });

  it('backward-only chain closes out as-is: mic-vault -> machine-room -> kitchenette, no forward links added', () => {
    renderApp('/district-ii/machine-room');
    expect(screen.getByText('← Mic Vault')).toBeInTheDocument();

    renderApp('/district-ii/kitchenette');
    expect(screen.getByText('← Machine Room')).toBeInTheDocument();
  });

  it('none of the two Batch 4 edges trigger Sound Lock; Sound Lock remains exclusive to Control Room <-> Studio A', () => {
    renderApp('/district-ii/kitchenette');
    fireEvent.click(screen.getByTitle('Machine Room — II-210C'));
    expect(screen.queryByText('Passing through the Sound Lock…')).not.toBeInTheDocument();
    expect(screen.getByText('Machine Room')).toBeInTheDocument();
  });

  it('Directory now shows both Batch 4 rooms as navigable — the full 13-room II-200 branch is Directory-complete', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByText('Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    expect(within(dir).getByText('Machine / Technical Room').tagName).toBe('BUTTON');
    expect(within(dir).getByText('Studio Kitchenette + Restrooms').tagName).toBe('BUTTON');
  });

  it('Floor Plan markers include both new destinations', () => {
    renderApp('/district-ii/machine-room');
    fireEvent.click(screen.getByText('Floor Plan'));
    expect(document.querySelectorAll('[title="Machine Room"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Studio Kitchenette"]').length).toBeGreaterThan(0);
  });

  it('global audio state persists across navigation into and between Batch 4 rooms', () => {
    renderApp('/district-ii/machine-room');
    fireEvent.click(screen.getByTitle('Toggle ambient audio'));
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
    fireEvent.click(screen.getByText('Explore →'));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Estate Explorer' })).getByText('Studio Kitchenette'));
    expect(screen.getByText('Studio Kitchenette')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
  });

  it('direct-link + reload resolves both rooms independently', () => {
    renderApp('/district-ii/machine-room');
    expect(screen.getByText('II-210C')).toBeInTheDocument();
    renderApp('/district-ii/kitchenette');
    expect(screen.getByText('II-211')).toBeInTheDocument();
  });

  it('reachability: both Batch 4 rooms are genuinely reachable via the contextual chain', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const byId = Object.fromEntries(verdicts.map((v) => [v.id, v]));
    expect(byId['machine-room'].reachable).toBe(true);
    expect(byId['machine-room'].via?.length).toBeGreaterThan(0);
    expect(byId['kitchenette'].reachable).toBe(true);
    expect(byId['kitchenette'].via?.length).toBeGreaterThan(0);
  });

  it('BRANCH CLOSURE: all 13 canonical II-200 destinations are live, routable, and pass the no-unreachable-live-destinations acceptance test', () => {
    const expectedLive = [
      'studio-a', 'control-room', 'vocal-booth', 'isolation-rooms', 'studio-b',
      'atmos', 'mastering', 'artist-lounge', 'producer-lounge', 'instrument-vault',
      'mic-vault', 'machine-room', 'kitchenette',
    ];
    for (const id of expectedLive) {
      const d = REGISTRY.find((r) => r.id === id)!;
      expect(d, `${id} should exist in the Registry`).toBeTruthy();
      expect(d.status, `${id} should be live`).toBe('live');
      expect(d.route, `${id} should have a real route`).toMatch(/^\/district-ii\//);
    }
    const failures = assertNoUnreachableLiveDestinations(REGISTRY);
    expect(failures).toEqual([]);
  });
});
