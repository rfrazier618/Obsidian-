import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';

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

describe('Estate 2.0 foundation — closing integration fixture', () => {
  it('renders a room from Registry configuration alone, with no hardcoded room component', () => {
    renderApp('/foundation/room-a');
    expect(screen.getByText('Room A')).toBeInTheDocument();
    expect(screen.getByText(/route: \/foundation\/room-a/)).toBeInTheDocument();
    const img = screen.getByAltText('Room A') as HTMLImageElement;
    expect(img.src).toContain('placeholder-room-a.svg');
  });

  it('walks the full flow: Global Nav → Explorer → Room A → hotspot → Room B → Directory → Room C', () => {
    renderApp('/');
    expect(screen.getByText('Estate 2.0 — Foundation')).toBeInTheDocument();

    // Global Nav -> hall is already global-nav-visible; open Explorer to reach Room A.
    fireEvent.click(screen.getByText('Explore →'));
    const explorer = screen.getByRole('dialog', { name: 'Estate Explorer' });
    fireEvent.click(within(explorer).getByText('Room A'));
    expect(screen.getByText('Room A')).toBeInTheDocument();

    // Contextual hotspot: Room A -> Room B
    fireEvent.click(screen.getByTitle('Room B'));
    expect(screen.getByText('Room B')).toBeInTheDocument();

    // Directory capability: Room B -> Directory -> Room C
    fireEvent.click(screen.getByText('Directory'));
    const directory = screen.getByRole('dialog', { name: 'District I Directory' });
    fireEvent.click(within(directory).getByText('Foundation Fixture — Room C'));
    expect(screen.getByText('Room C')).toBeInTheDocument();
  });

  it('Directory shows current room as "You are here" and never as a button', () => {
    renderApp('/foundation/room-b');
    fireEvent.click(screen.getByText('Directory'));
    const directory = screen.getByRole('dialog', { name: 'District I Directory' });
    const currentRow = within(directory).getByText('Foundation Fixture — Room B');
    expect(currentRow.tagName).toBe('SPAN'); // not a <button>
    expect(within(directory).getByText('You are here')).toBeInTheDocument();
  });

  it('Directory shows a planned/unbuilt destination as visible but not navigable', () => {
    renderApp('/foundation/room-b');
    fireEvent.click(screen.getByText('Directory'));
    const directory = screen.getByRole('dialog', { name: 'District I Directory' });
    const plannedRow = within(directory).getByText('Foundation Fixture — Room D');
    expect(plannedRow.tagName).toBe('SPAN'); // not a <button> — visible, not falsely navigable
    // Directory now also lists every un-migrated A-202 Rev. 4 room as
    // "Not yet built" (District II reference slice) — assert Room D's
    // own row carries the tag, not that it's the only such row.
    const roomDRow = plannedRow.closest('li')!;
    expect(within(roomDRow).getByText('Not yet built')).toBeInTheDocument();
  });

  it('Floor Plan opens with the correct plan asset, canon notice, and markers for every room on that sheet', () => {
    renderApp('/foundation/room-c');
    fireEvent.click(screen.getByText('Floor Plan'));
    const plan = screen.getByRole('dialog', { name: /Floor Plan/ });
    const img = within(plan).getByAltText(/Floor plan/) as HTMLImageElement;
    expect(img.src).toContain('placeholder-floorplan.svg');
    expect(within(plan).getByText(/non-canon/)).toBeInTheDocument();
    // markers exist for every destination sharing this sheet, including the unbuilt Room D
    expect(document.querySelectorAll('[title="Room A"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Room D"]').length).toBeGreaterThan(0);
  });

  it('Floor Plan zoom controls step through the defined levels', () => {
    renderApp('/foundation/room-c');
    fireEvent.click(screen.getByText('Floor Plan'));
    expect(screen.getByText('100%')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Zoom in'));
    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('a fresh mount of a room with a floor-plan capability always starts with the panel closed', () => {
    // Room-local state (directoryOpen/floorPlanOpen) is React useState scoped to
    // RoomScene — it cannot persist across an unmount/remount by construction.
    // This is the jsdom-level proof; the live-browser check additionally
    // confirms it across a REAL client-side navigation, not just a fresh render.
    renderApp('/foundation/room-c');
    expect(screen.queryByRole('dialog', { name: /Floor Plan/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Floor Plan'));
    expect(screen.getByRole('dialog', { name: /Floor Plan/ })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog', { name: /Floor Plan/ })).not.toBeInTheDocument();
  });

  it('opens the one shared EstateModal from a room capability, independent of any per-room modal', () => {
    renderApp('/foundation/room-a');
    fireEvent.click(screen.getByText('View Media'));
    expect(screen.getByRole('dialog', { name: 'Shared Modal' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Shared Modal' })).not.toBeInTheDocument();
  });

  it('toggling global audio state persists across a room navigation (AudioContext sits above the router)', () => {
    renderApp('/foundation/room-a');
    const audioBtn = screen.getByTitle('Toggle ambient audio');
    expect(audioBtn).toHaveTextContent('♪ on');
    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveTextContent('♪ off');

    fireEvent.click(screen.getByTitle('Room B'));
    expect(screen.getByText('Room B')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
  });

  it('resolves a destination directly by URL (simulates a refresh / direct link) on Room B specifically', () => {
    renderApp('/foundation/room-b');
    expect(screen.getByText('Room B')).toBeInTheDocument();
    expect(screen.getByText('Directory')).toBeInTheDocument();
  });

  it('renders a 404 state for an unregistered route instead of crashing', () => {
    renderApp('/nothing/here');
    expect(screen.getByText(/No destination matches this route/)).toBeInTheDocument();
  });

  it('does not render a route for a status:"planned" destination (Room D has no page of its own yet)', () => {
    renderApp('/foundation/room-d');
    expect(screen.getByText(/No destination matches this route/)).toBeInTheDocument();
  });
});
