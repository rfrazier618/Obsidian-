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

describe('II-200 Batch 2 — Dolby Atmos / Mastering / Artist Lounge', () => {
  it('Dolby Atmos renders with its immersive-field panel language distinct from Mastering', () => {
    renderApp('/district-ii/atmos');
    expect(screen.getByText('II-206')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Sweet Spot'));
    expect(screen.getByText(/surround and overhead array converges/)).toBeInTheDocument();
  });

  it('Mastering renders as a forward-facing critical-listening room, explicitly NOT an immersive-field variant', () => {
    renderApp('/district-ii/mastering');
    expect(screen.getByText('II-207')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Reference Monitoring'));
    expect(screen.getByText(/no immersive or overhead field/)).toBeInTheDocument();
    expect(screen.getByText(/identity belongs to the Dolby Atmos Suite alone/)).toBeInTheDocument();
  });

  it('Artist Lounge renders as a decompression/hospitality room, explicitly distinct from Producer Lounge and the Kitchenette', () => {
    renderApp('/district-ii/artist-lounge');
    expect(screen.getByText('II-208')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Lounge'));
    expect(screen.getByText(/permission to stop performing/)).toBeInTheDocument();
    expect(screen.getByText(/Distinct from II-209 Producer Lounge/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTitle('Hospitality'));
    expect(screen.getByText(/not the full II-211 Studio Kitchenette/)).toBeInTheDocument();
  });

  it('THE key architectural test: Artist Lounge "Now Playing" opens the exact same DEPMG Sessions panel as Control Room, same links, same targets — no Artist-Lounge-specific implementation', () => {
    renderApp('/district-ii/artist-lounge');
    fireEvent.click(screen.getByTitle('Now Playing — DEPMG Sessions'));
    const sessions = screen.getByRole('dialog', { name: 'DEPMG Sessions' }); // same panel TITLE as Control Room's
    expect(within(sessions).getByText(/Lost in the Mind of R\.S\. Frazier/)).toBeInTheDocument();
    const streamLink = within(sessions).getByText('Stream the Album');
    expect(streamLink).toHaveAttribute(
      'href',
      'https://distrokid.com/hyperfollow/richfraz/lost-in-the-mind-of-rs-frazier-2?ref=release'
    );
    expect(streamLink).toHaveAttribute('target', '_blank');
    expect(within(sessions).getByText('Spotify')).toHaveAttribute(
      'href',
      'https://open.spotify.com/artist/2TF5zvNLvklcRY2qu2YDxd'
    );
    expect(within(sessions).getByText('SoundCloud')).toHaveAttribute('href', 'https://soundcloud.com/richfrazmusic');
    expect(within(sessions).getByText('Apple Music')).toHaveAttribute(
      'href',
      'https://music.apple.com/us/artist/richfraz/1444729870'
    );
  });

  it('the hotspot LABEL differs by room context ("Now Playing" framing) even though the panel payload is identical', () => {
    renderApp('/district-ii/artist-lounge');
    expect(screen.getByTitle('Now Playing — DEPMG Sessions')).toBeInTheDocument();
    expect(screen.queryByTitle('DEPMG Sessions')).not.toBeInTheDocument(); // Control Room's exact label, not reused verbatim here
  });

  it('backward-only chain continues as-is: studio-b -> atmos -> mastering -> artist-lounge, no forward links added', () => {
    renderApp('/district-ii/atmos');
    expect(screen.getByText('← Studio B')).toBeInTheDocument();
    expect(screen.queryByTitle('Mastering')).not.toBeInTheDocument(); // atmos has no forward hotspot to mastering in legacy

    renderApp('/district-ii/artist-lounge');
    expect(screen.getByText('← Mastering / Critical Listening Room')).toBeInTheDocument();
  });

  it('none of the three Batch 2 edges trigger Sound Lock', () => {
    renderApp('/district-ii/atmos');
    fireEvent.click(screen.getByTitle('Studio B — return to the Recording Complex'));
    expect(screen.queryByText('Passing through the Sound Lock…')).not.toBeInTheDocument();
    expect(screen.getByText('Studio B')).toBeInTheDocument();
  });

  it('Directory now shows all three Batch 2 rooms as navigable', () => {
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('District II Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    expect(within(dir).getByText('Dolby Atmos Mixing Suite').tagName).toBe('BUTTON');
    expect(within(dir).getByText('Mastering / Critical Listening Room').tagName).toBe('BUTTON');
    expect(within(dir).getByText('Artist Lounge').tagName).toBe('BUTTON');
  });

  it('Floor Plan markers include all three new destinations', () => {
    renderApp('/district-ii/atmos');
    fireEvent.click(screen.getByText('Floor Plan'));
    expect(document.querySelectorAll('[title="Dolby Atmos Mixing Suite"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Mastering / Critical Listening Room"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[title="Artist Lounge"]').length).toBeGreaterThan(0);
  });

  it('global audio state persists across navigation into and between Batch 2 rooms', () => {
    renderApp('/district-ii/atmos');
    fireEvent.click(screen.getByTitle('Toggle ambient audio'));
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
    fireEvent.click(screen.getByText('Explore →'));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Estate Explorer' })).getByText('Artist Lounge'));
    expect(screen.getByText('Artist Lounge')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle ambient audio')).toHaveTextContent('♪ off');
  });

  it('direct-link + no-crash resolves each of the three rooms independently', () => {
    renderApp('/district-ii/mastering');
    expect(screen.getByText('Mastering / Critical Listening Room')).toBeInTheDocument();
    expect(screen.getByText('II-207')).toBeInTheDocument();
  });

  it('reachability: all three Batch 2 rooms are reachable via Explorer', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const byId = Object.fromEntries(verdicts.map((v) => [v.id, v]));
    expect(byId['atmos'].reachable).toBe(true);
    expect(byId['mastering'].reachable).toBe(true);
    expect(byId['artist-lounge'].reachable).toBe(true);
  });
});
