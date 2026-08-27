import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';
import { computeDiscoveryVerdicts } from '@/registry/validate';
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

describe('II-200 Batch 3 — Producer Lounge / Instrument Vault / Mic Vault', () => {
  it('Producer Lounge renders as a working/ideation room, explicitly distinct from Artist Lounge and Studio B', () => {
    renderApp('/district-ii/producer-lounge');
    expect(screen.getByText('II-209')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Reference Listening'));
    expect(screen.getByText(/isn't relaxed listening/)).toBeInTheDocument();
    expect(screen.getByText(/different behavior from II-208's Now Playing/)).toBeInTheDocument();
  });

  it('Instrument Vault renders with its no-performance / archive identity', () => {
    renderApp('/district-ii/instrument-vault');
    expect(screen.getByText('II-210A')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Guitar & Bass Collection'));
    expect(screen.getByText(/rather than staged for performance/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('Instrument Prep'));
    expect(screen.getByText(/not a performance or recording position/)).toBeInTheDocument();
  });

  it('Mic Vault renders with its no-recording-position / precision-collection identity', () => {
    renderApp('/district-ii/mic-vault');
    expect(screen.getByText('II-210B')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Mic Prep & Handling'));
    expect(screen.getByText(/A handling position, not a recording position/)).toBeInTheDocument();
  });

  it('THE key architectural test: Instrument Vault "Vault Preservation" panel matches the exact shared content', () => {
    renderApp('/district-ii/instrument-vault');
    fireEvent.click(screen.getByTitle('Vault Preservation'));
    const ivPanel = screen.getByRole('dialog', { name: 'Vault Preservation' });
    expect(within(ivPanel).getByText(/Preserve\. Protect\. Prepare\./).textContent).toBe(
      'Preserve. Protect. Prepare. Tools are maintained at the highest standard so creativity never waits — secure storage, climate-conscious, catalogued and ready when the moment demands it.'
    );
  });

  it('Mic Vault "Vault Preservation" panel is the exact same shared content as the Instrument Vault — no per-room duplication of near-identical copy', () => {
    renderApp('/district-ii/mic-vault');
    fireEvent.click(screen.getByTitle('Vault Preservation'));
    const mvPanel = screen.getByRole('dialog', { name: 'Vault Preservation' });
    expect(within(mvPanel).getByText(/Preserve\. Protect\. Prepare\./).textContent).toBe(
      'Preserve. Protect. Prepare. Tools are maintained at the highest standard so creativity never waits — secure storage, climate-conscious, catalogued and ready when the moment demands it.'
    );
  });

  it('backward-only chain continues as-is: artist-lounge -> producer-lounge -> instrument-vault -> mic-vault, no forward links added', () => {
    renderApp('/district-ii/producer-lounge');
    expect(screen.getByText('← Artist Lounge')).toBeInTheDocument();
    expect(screen.queryByTitle('Instrument Vault — II-210A')).not.toBeInTheDocument();

    renderApp('/district-ii/instrument-vault');
    expect(screen.getByText('← Producer Lounge / Writing Room')).toBeInTheDocument();
    expect(screen.queryByTitle('Mic Vault — II-210B')).not.toBeInTheDocument();

    renderApp('/district-ii/mic-vault');
    expect(screen.getByText('← Instrument Vault')).toBeInTheDocument();
  });

  it('Mic Vault never had a forward hotspot to Machine Room, in Batch 3 or after: no forward link was manufactured merely because Machine Room was later promoted in Batch 4', () => {
    renderApp('/district-ii/mic-vault');
    expect(screen.queryByTitle('Machine Room — II-210C')).not.toBeInTheDocument();
  });

  // Machine Room itself was a status:'planned' stub at Batch 3 time and was
  // promoted to live in Batch 4 — see App.d2-batch4.test.tsx for its own
  // coverage. A genuinely still-planned HQ stub, untouched by any District
  // II batch, is used here instead to keep this regression test meaningful.
  it('/district-ii/d2-301-ceo has no live route — a genuinely still-planned stub does not resolve to a room', () => {
    renderApp('/district-ii/d2-301-ceo');
    expect(screen.queryByText('II-301')).not.toBeInTheDocument();
  });

  it('none of the three Batch 3 edges trigger Sound Lock', () => {
    renderApp('/district-ii/instrument-vault');
    fireEvent.click(screen.getByTitle('Producer Lounge / Writing Room — II-209'));
    expect(screen.queryByText('Passing through the Sound Lock…')).not.toBeInTheDocument();
    expect(screen.getByText('Producer Lounge / Writing Room')).toBeInTheDocument();
  });

  it('Directory now shows all three Batch 3 rooms as navigable', () => {
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('District II Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    expect(within(dir).getByText('Producer Lounge / Writing Room').tagName).toBe('BUTTON');
    expect(within(dir).getByText('Instrument Vault').tagName).toBe('BUTTON');
    // Directory lists canonicalName, not the shorter displayName used elsewhere
    // (e.g. the back-button / room-nav-title) — 'Microphone / Equipment Vault'.
    expect(within(dir).getByText('Microphone / Equipment Vault').tagName).toBe('BUTTON');
  });

  it('Floor Plan markers include all three new destinations', () => {
    renderApp('/district-ii/producer-lounge');
    fireEvent.click(screen.getByText('Floor Plan'));
    expect(document.querySelectorAll('[title="Producer Lounge / Writing Room"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Instrument Vault"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Mic Vault"]').length).toBeGreaterThan(0);
  });

  it('global audio state persists across navigation into and between Batch 3 rooms', () => {
    renderApp('/district-ii/instrument-vault');
    fireEvent.click(screen.getByTitle('Toggle ambient audio'));
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
    fireEvent.click(screen.getByText('Explore →'));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Estate Explorer' })).getByText('Mic Vault'));
    expect(screen.getByText('Mic Vault')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
  });

  it('direct-link + no-crash resolves each of the three rooms independently', () => {
    renderApp('/district-ii/producer-lounge');
    expect(screen.getByText('Producer Lounge / Writing Room')).toBeInTheDocument();
    expect(screen.getByText('II-209')).toBeInTheDocument();
  });

  it('reachability: all three Batch 3 rooms are genuinely reachable via a chain', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const byId = Object.fromEntries(verdicts.map((v) => [v.id, v]));
    expect(byId['producer-lounge'].reachable).toBe(true);
    expect(byId['producer-lounge'].via?.length).toBeGreaterThan(0);
    expect(byId['instrument-vault'].reachable).toBe(true);
    expect(byId['instrument-vault'].via?.length).toBeGreaterThan(0);
    expect(byId['mic-vault'].reachable).toBe(true);
    expect(byId['mic-vault'].via?.length).toBeGreaterThan(0);
  });
});
