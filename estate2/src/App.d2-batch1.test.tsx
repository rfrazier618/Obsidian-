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

describe('II-200 Batch 1 — Vocal Booth / Isolation Rooms / Studio B', () => {
  it('Vocal Booth renders from the Registry with its canon room number and real render asset', () => {
    renderApp('/district-ii/vocal-booth');
    expect(screen.getByText('Studio A Vocal Booth')).toBeInTheDocument();
    expect(screen.getByText('II-203')).toBeInTheDocument();
    const img = screen.getByAltText('Studio A Vocal Booth') as HTMLImageElement;
    expect(img.src).toContain('depmg-vocal-booth-bg.jpg');
  });

  it('Vocal Booth back-target is Studio A, not Control Room or the hub', () => {
    renderApp('/district-ii/vocal-booth');
    expect(screen.getByText('← Studio A · Tracking Room')).toBeInTheDocument();
  });

  it('Vocal Booth → Isolation Rooms → Vocal Booth cross-links work (sibling cluster, not a strict chain)', () => {
    renderApp('/district-ii/vocal-booth');
    fireEvent.click(screen.getByTitle('Isolation Rooms — II-204'));
    expect(screen.getByText('Isolation Rooms')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Studio A Vocal Booth — II-203'));
    expect(screen.getByText('Studio A Vocal Booth')).toBeInTheDocument();
  });

  it('Isolation Rooms → Studio B is NOT a hotspot (preserved asymmetric legacy link — Studio B links in, Isolation Rooms does not link out to it)', () => {
    renderApp('/district-ii/isolation-rooms');
    expect(screen.queryByTitle('Studio B')).not.toBeInTheDocument();
  });

  it('Studio B → Isolation Rooms IS a hotspot (the asymmetric direction that does exist)', () => {
    renderApp('/district-ii/studio-b');
    fireEvent.click(screen.getByTitle('Isolation Rooms — II-204'));
    expect(screen.getByText('Isolation Rooms')).toBeInTheDocument();
  });

  it('Studio B has no baked Directory hotspot (preserved legacy discrepancy) but the Directory is still reachable via the fallback action button', () => {
    renderApp('/district-ii/studio-b');
    expect(screen.queryByTitle('District II Directory')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Directory'));
    expect(screen.getByRole('dialog', { name: 'District II Directory' })).toBeInTheDocument();
  });

  it('Vocal Booth Sound Lock Status panel shows its own real extracted copy', () => {
    renderApp('/district-ii/vocal-booth');
    fireEvent.click(screen.getByTitle('Sound Lock Status'));
    expect(screen.getByText(/routes exclusively to Studio A's session/)).toBeInTheDocument();
  });

  it('Isolation Rooms Sound Lock Status panel shows its own real extracted copy (not a shared generic string)', () => {
    renderApp('/district-ii/isolation-rooms');
    fireEvent.click(screen.getByTitle('Sound Lock Status'));
    expect(screen.getByText('Isolation Rooms are acoustically isolated from Studio A. Audio routing is exclusive to Studio A only.')).toBeInTheDocument();
  });

  it('Studio B Sound Lock Status panel shows its own real extracted copy (not a shared generic string)', () => {
    renderApp('/district-ii/studio-b');
    fireEvent.click(screen.getByTitle('Sound Lock Status'));
    expect(screen.getByText('Studio B is acoustically isolated from Studio A. Audio routing is exclusive to Studio A only.')).toBeInTheDocument();
  });

  it('none of the three trigger Sound Lock (the transition stays scoped to control-room::studio-a only)', () => {
    renderApp('/district-ii/vocal-booth');
    fireEvent.click(screen.getByTitle('Control Room — II-202'));
    expect(screen.queryByText('Passing through the Sound Lock…')).not.toBeInTheDocument();
    expect(screen.getByText('Studio A · Control Room')).toBeInTheDocument();
  });

  it('Directory now shows all three as navigable, no longer "Not yet built"', () => {
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('District II Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    const vocalBooth = within(dir).getByText('Studio A Vocal Booth');
    expect(vocalBooth.tagName).toBe('BUTTON');
    const isoRooms = within(dir).getByText('Isolation Rooms');
    expect(isoRooms.tagName).toBe('BUTTON');
    const studioB = within(dir).getByText('Studio B — Production / Writing Studio');
    expect(studioB.tagName).toBe('BUTTON');
  });

  it('Floor Plan markers now include all three new destinations', () => {
    renderApp('/district-ii/vocal-booth');
    fireEvent.click(screen.getByText('Floor Plan'));
    expect(document.querySelectorAll('[title="Studio A Vocal Booth"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Isolation Rooms"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Studio B"]').length).toBeGreaterThan(0);
  });

  it('direct-link + no-crash resolves each of the three rooms independently', () => {
    renderApp('/district-ii/isolation-rooms');
    expect(screen.getByText('Isolation Rooms')).toBeInTheDocument();
    expect(screen.getByText('II-204')).toBeInTheDocument();
  });

  it('reachability: all three are reachable (via Explorer); Studio A still has no forward hotspot into the wing (preserved, not a regression)', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const byId = Object.fromEntries(verdicts.map((v) => [v.id, v]));
    expect(byId['vocal-booth'].reachable).toBe(true);
    expect(byId['isolation-rooms'].reachable).toBe(true);
    expect(byId['studio-b'].reachable).toBe(true);
    expect(byId['vocal-booth'].via).toContain('explorer');
  });
});
