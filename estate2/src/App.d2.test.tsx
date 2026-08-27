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

describe('District II reference slice — Reception → II-110 → Control Room ⇄ Studio A', () => {
  it('Reception renders from the Registry with its canon room number and real render asset', () => {
    renderApp('/district-ii/reception');
    expect(screen.getByText('DEPMG Executive Reception')).toBeInTheDocument();
    expect(screen.getByText('II-101')).toBeInTheDocument();
    const img = screen.getByAltText('DEPMG Executive Reception') as HTMLImageElement;
    expect(img.src).toContain('depmg-reception-bg.jpg');
  });

  it('an informational hotspot shows a toast and does NOT navigate', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('Recording Complex Reveal — II-102'));
    expect(screen.getByText(/II-102 is a reveal, not a passage/)).toBeInTheDocument();
    // still on Reception — no navigation happened
    expect(screen.getByText('DEPMG Executive Reception')).toBeInTheDocument();
  });

  it('out-of-scope District III/IV and HQ hotspots give an honest toast instead of a broken link', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('District III — GEMINI Speakeasy'));
    expect(screen.getByText(/GEMINI Speakeasy hasn.t migrated to Estate 2\.0 yet/)).toBeInTheDocument();
  });

  it('"Return Home" hotspot navigates to the hub', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('Return Home'));
    expect(screen.getByText('Estate 2.0 — Foundation')).toBeInTheDocument();
  });

  it('"Return to the Estate" hotspot (preserved legacy duplicate of "Return Home") also navigates to the hub', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('Return to the Estate'));
    expect(screen.getByText('Estate 2.0 — Foundation')).toBeInTheDocument();
  });

  it('II-110 threshold keypad: any 4-digit code is accepted and admits to Control Room', async () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('Secure Creative Threshold — II-110'));
    const keypad = screen.getByRole('dialog', { name: /DEPMG Secure Creative Threshold/ });
    expect(within(keypad).getByText('Enter access code')).toBeInTheDocument();

    ['4', '2', '0', '1'].forEach((d) => fireEvent.click(within(keypad).getByText(d, { selector: 'button' })));
    expect(within(keypad).getByText('Press Enter')).toBeInTheDocument();
    fireEvent.click(within(keypad).getByText('Enter'));
    expect(within(keypad).getByText('Access granted.')).toBeInTheDocument();

    await screen.findByText('Studio A · Control Room', {}, { timeout: 2000 });
  });

  it('the threshold keypad refuses Enter before 4 digits, and Clear resets the buffer', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('Secure Creative Threshold — II-110'));
    const keypad = screen.getByRole('dialog', { name: /DEPMG Secure Creative Threshold/ });
    fireEvent.click(within(keypad).getByText('7', { selector: 'button' }));
    fireEvent.click(within(keypad).getByText('Enter'));
    expect(within(keypad).getByText('Code must be 4 digits')).toBeInTheDocument();
    fireEvent.click(within(keypad).getByText('Clear'));
    expect(within(keypad).getByText('Enter access code')).toBeInTheDocument();
  });

  it('closing the keypad without completing it never navigates, and reopening starts fresh (no persisted admission state)', () => {
    renderApp('/district-ii/reception');
    fireEvent.click(screen.getByTitle('Secure Creative Threshold — II-110'));
    let keypad = screen.getByRole('dialog', { name: /DEPMG Secure Creative Threshold/ });
    fireEvent.click(within(keypad).getByText('9', { selector: 'button' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /DEPMG Secure Creative Threshold/ })).not.toBeInTheDocument();
    expect(screen.getByText('DEPMG Executive Reception')).toBeInTheDocument(); // still on Reception

    fireEvent.click(screen.getByTitle('Secure Creative Threshold — II-110'));
    keypad = screen.getByRole('dialog', { name: /DEPMG Secure Creative Threshold/ });
    expect(within(keypad).getByText('Enter access code')).toBeInTheDocument(); // not "9···"
  });

  it('a direct-link/reload straight into Control Room bypasses nothing (there was never a real gate)', () => {
    renderApp('/district-ii/control-room');
    expect(screen.getByText('Studio A · Control Room')).toBeInTheDocument();
  });

  it('Control Room panels show real extracted content — Console, Gear, and Sessions with working links', () => {
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('The Console — II-202'));
    expect(screen.getByRole('dialog', { name: 'The Console · II-202' })).toBeInTheDocument();
    expect(screen.getByText(/full-format monitoring/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });

    fireEvent.click(screen.getByTitle('Outboard & Gear'));
    expect(screen.getByRole('dialog', { name: 'Outboard &amp; Gear' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });

    fireEvent.click(screen.getByTitle('DEPMG Sessions'));
    const sessions = screen.getByRole('dialog', { name: 'DEPMG Sessions' });
    expect(within(sessions).getByText('Stream the Album')).toHaveAttribute(
      'href',
      'https://distrokid.com/hyperfollow/richfraz/lost-in-the-mind-of-rs-frazier-2?ref=release'
    );
  });

  it('Control Room → Studio A plays the Sound Lock transition before arriving', async () => {
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('Enter Studio A — II-201'));
    expect(screen.getByText('Passing through the Sound Lock…')).toBeInTheDocument();
    // still mid-transition — must not have navigated yet
    expect(screen.queryByText('Studio A · Tracking Room')).not.toBeInTheDocument();
    await screen.findByText('Studio A · Tracking Room', {}, { timeout: 2000 });
    expect(screen.queryByText('Passing through the Sound Lock…')).not.toBeInTheDocument();
  });

  it('Studio A → Control Room (back button) ALSO plays Sound Lock — it is an edge property, not a hotspot-specific one', async () => {
    renderApp('/district-ii/studio-a');
    fireEvent.click(screen.getByText('← Studio A · Control Room'));
    expect(screen.getByText('Passing through the Sound Lock…')).toBeInTheDocument();
    await screen.findByText('Studio A · Control Room', {}, { timeout: 2000 });
  });

  it('Studio A′s Vocal Position panel explicitly distinguishes itself from II-203 Vocal Booth', () => {
    renderApp('/district-ii/studio-a');
    fireEvent.click(screen.getByTitle('Vocal Position'));
    expect(screen.getByText(/not an isolated booth/)).toBeInTheDocument();
    expect(screen.getByText(/II-203 Vocal Booth, a separate room down the cluster/)).toBeInTheDocument();
  });

  it('Studio A′s Grand Piano panel preserves the D-274 disclaimer as a render-layer note, not a spec claim', () => {
    renderApp('/district-ii/studio-a');
    fireEvent.click(screen.getByTitle('Grand Piano'));
    expect(screen.getByText(/Steinway & Sons D-274 as a placeholder, not a confirmed instrument selection/)).toBeInTheDocument();
  });

  it('Directory from Control Room shows all four fidelity states correctly', () => {
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('District II Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });

    // current
    const here = within(dir).getByText('Studio A Control Room');
    expect(here.tagName).toBe('SPAN');
    expect(within(here.closest('li')!).getByText('You are here')).toBeInTheDocument();

    // navigable (live, different room)
    const reception = within(dir).getByText('Central DEPMG Executive Reception');
    expect(reception.tagName).toBe('BUTTON');

    // reference-only (live, but never its own room)
    const reveal = within(dir).getByText('Recording Complex Reveal');
    expect(reveal.tagName).toBe('SPAN');
    expect(within(reveal.closest('li')!).getByText('Reference only')).toBeInTheDocument();

    // planned / not yet built (vocal-booth migrated in Batch 1, atmos in
    // Batch 2 — use boardroom, an HQ room untouched until HQ migration begins)
    const boardroomRow = within(dir).getByText('Executive Boardroom');
    expect(boardroomRow.tagName).toBe('SPAN');
    expect(within(boardroomRow.closest('li')!).getByText('Not yet built')).toBeInTheDocument();
  });

  it('clicking a navigable Directory row actually navigates', () => {
    renderApp('/district-ii/studio-a');
    fireEvent.click(screen.getByTitle('District II Directory'));
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    fireEvent.click(within(dir).getByText('Central DEPMG Executive Reception'));
    expect(screen.getByText('DEPMG Executive Reception')).toBeInTheDocument();
  });

  it('Floor Plan from any D2 room shows the real A-202 asset and its exact canon notice', () => {
    renderApp('/district-ii/studio-a');
    fireEvent.click(screen.getByTitle('Floor Plan — A-202'));
    const plan = screen.getByRole('dialog', { name: /Floor Plan/ });
    const img = within(plan).getByAltText(/Floor plan/) as HTMLImageElement;
    expect(img.src).toContain('a202-floorplan.jpg');
    expect(within(plan).getByText(/Rev\. 4 remains the sole governing architectural/)).toBeInTheDocument();
  });

  it('back targets are explicit per destination, not assumed to be the Estate hub', () => {
    renderApp('/district-ii/control-room');
    expect(screen.getByText('← DEPMG Executive Reception')).toBeInTheDocument();

    renderApp('/district-ii/studio-a');
    expect(screen.getByText('← Studio A · Control Room')).toBeInTheDocument();
  });

  it('none of the three migrated D2 rooms appear in Global Navigation (not flagged globalNavVisibility)', () => {
    renderApp('/');
    expect(screen.queryByText('DEPMG Executive Reception')).not.toBeInTheDocument();
    expect(screen.queryByText('Studio A · Control Room')).not.toBeInTheDocument();
  });

  it('Explorer lists all three migrated D2 rooms under District II', () => {
    renderApp('/');
    fireEvent.click(screen.getByText('Explore →'));
    const explorer = screen.getByRole('dialog', { name: 'Estate Explorer' });
    expect(within(explorer).getByText('DEPMG Executive Reception')).toBeInTheDocument();
    expect(within(explorer).getByText('Studio A · Control Room')).toBeInTheDocument();
    expect(within(explorer).getByText('Studio A · Tracking Room')).toBeInTheDocument();
  });

  it('reachability: Reception/Control Room/Studio A are all reachable; threshold/reveal are exempt (no route); planned stubs are not evaluated', () => {
    const verdicts = computeDiscoveryVerdicts(REGISTRY);
    const byId = Object.fromEntries(verdicts.map((v) => [v.id, v]));
    expect(byId['depmg'].reachable).toBe(true);
    expect(byId['control-room'].reachable).toBe(true);
    expect(byId['studio-a'].reachable).toBe(true);
    expect(byId['d2-110-threshold'].reason).toContain('No route');
    expect(byId['vocal-booth'].reachable).toBe(true); // migrated in Batch 1
    expect(byId['atmos'].reachable).toBe(true); // migrated in Batch 2
    expect(byId['boardroom'].reason).toContain('status:planned'); // HQ, not yet touched
  });

  it('direct-link resolves Studio A specifically, independent of navigation history', () => {
    renderApp('/district-ii/studio-a');
    expect(screen.getByText('Studio A · Tracking Room')).toBeInTheDocument();
    expect(screen.getByText('II-201')).toBeInTheDocument();
  });
});
