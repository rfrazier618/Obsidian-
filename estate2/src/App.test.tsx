import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <RootProvider>
        <App />
      </RootProvider>
    </MemoryRouter>
  );
}

describe('Estate 2.0 foundation — end-to-end proof', () => {
  it('renders a room from Registry configuration alone, with no hardcoded room component', () => {
    renderApp('/foundation/dummy-room');
    expect(screen.getByText('Dummy Room')).toBeInTheDocument();
    expect(screen.getByText(/route: \/foundation\/dummy-room/)).toBeInTheDocument();
    const img = screen.getByAltText('Dummy Room') as HTMLImageElement;
    expect(img.src).toContain('placeholder-dummy-room.svg');
  });

  it('positions hotspots as registry-declared percentages, not hardcoded pixels', () => {
    renderApp('/foundation/dummy-room');
    const annexHotspot = screen.getByTitle('The Annex');
    expect(annexHotspot).toHaveStyle({ left: '70%', top: '68.9%', width: '22.5%', height: '20%' });
  });

  it('navigates via contextual hotspot (nav layer 3)', () => {
    renderApp('/foundation/dummy-room');
    fireEvent.click(screen.getByTitle('The Annex'));
    expect(screen.getByText('Dummy Room — Annex')).toBeInTheDocument();
  });

  it('navigates via Estate Explorer (nav layer 2)', () => {
    renderApp('/foundation/dummy-room');
    fireEvent.click(screen.getByText('Explore →'));
    const dialog = screen.getByRole('dialog', { name: 'Estate Explorer' });
    fireEvent.click(within(dialog).getByText('Dummy Room — Annex'));
    expect(screen.getByText('Dummy Room — Annex')).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Estate Explorer' })).not.toBeInTheDocument();
  });

  it('navigates via Global Navigation (nav layer 1)', () => {
    renderApp('/foundation/dummy-room');
    fireEvent.click(screen.getByText('The Estate'));
    // estate-hall is the only globalNavVisibility:true entry in the foundation dataset
    expect(screen.getByText('Estate 2.0 — Foundation')).toBeInTheDocument();
  });

  it('opens the one shared EstateModal from a hotspot declared entirely in the Registry', () => {
    renderApp('/foundation/dummy-room');
    fireEvent.click(screen.getByTitle('Open a shared modal'));
    expect(screen.getByRole('dialog', { name: 'Shared Modal' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Shared Modal' })).not.toBeInTheDocument();
  });

  it('resolves a destination directly by URL (simulates a refresh / direct link)', () => {
    renderApp('/foundation/dummy-room-annex');
    expect(screen.getByText('Dummy Room — Annex')).toBeInTheDocument();
  });

  it('renders a 404 state for an unregistered route instead of crashing', () => {
    renderApp('/nothing/here');
    expect(screen.getByText(/No destination matches this route/)).toBeInTheDocument();
  });
});
