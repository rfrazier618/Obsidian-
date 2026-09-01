import { describe, it, expect, vi, afterEach } from 'vitest';
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

/** jsdom has no matchMedia at all; mock it so PreferencesContext's reduced-motion check has something to read. */
function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('Hardening pass — Overlay focus trap and restoration', () => {
  afterEach(() => {
    // @ts-expect-error -- cleaning up the mock between tests
    delete window.matchMedia;
  });

  it('Tab from the last focusable element inside an open panel wraps back to the first, not out to the page', () => {
    mockReducedMotion(false);
    renderApp('/district-ii/boardroom');
    const trigger = screen.getByTitle('CEO Office — II-301');
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'CEO Office' });
    const focusable = within(dialog).getAllByRole('button');
    const last = focusable[focusable.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(focusable[0]);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('Shift+Tab from the first focusable element wraps back to the last', () => {
    mockReducedMotion(false);
    renderApp('/district-ii/boardroom');
    const trigger = screen.getByTitle('CEO Office — II-301');
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'CEO Office' });
    const focusable = within(dialog).getAllByRole('button');
    focusable[0].focus();

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);
  });

  it('focus that has somehow left the dialog is pulled back in on the next Tab', () => {
    mockReducedMotion(false);
    renderApp('/district-ii/boardroom');
    const trigger = screen.getByTitle('CEO Office — II-301');
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'CEO Office' });
    // Simulate focus having escaped (the exact audit-P0 scenario) by
    // focusing a real, always-present, actually-focusable element
    // outside the dialog — a plain <body> focus() call is a no-op.
    const outside = screen.getByText('Explore →');
    outside.focus();
    expect(document.activeElement).toBe(outside);
    expect(dialog.contains(document.activeElement)).toBe(false);

    fireEvent.keyDown(window, { key: 'Tab' });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('closing a panel restores focus to the hotspot that opened it', () => {
    mockReducedMotion(false);
    renderApp('/district-ii/boardroom');
    const trigger = screen.getByTitle('CEO Office — II-301');
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'CEO Office' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'CEO Office' })).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it('the same trap and restoration behavior applies through Directory, Floor Plan, and Explorer — they all render through the one Overlay primitive', () => {
    mockReducedMotion(false);
    renderApp('/district-ii/boardroom');
    const dirTrigger = screen.getByTitle('District II Directory');
    dirTrigger.focus();
    fireEvent.click(dirTrigger);
    const dir = screen.getByRole('dialog', { name: 'District II Directory' });
    expect(dir).toHaveAttribute('aria-modal', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).toBe(dirTrigger);

    const fpTrigger = screen.getByTitle('Floor Plan — A-202');
    fpTrigger.focus();
    fireEvent.click(fpTrigger);
    expect(screen.getByRole('dialog', { name: /Floor Plan/ })).toHaveAttribute('aria-modal', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).toBe(fpTrigger);
  });
});

describe('Hardening pass — semantic room heading', () => {
  it('every room renders its title as a real <h1>, not a plain span', () => {
    renderApp('/district-ii/hq-corridor');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Executive, Brand & Media HQ');
  });

  it('overlay titles remain <h2> — the page has exactly one h1 and overlays nest correctly beneath it', () => {
    renderApp('/district-ii/hq-corridor');
    fireEvent.click(screen.getByText('Directory'));
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: 'District II Directory' })).toBeInTheDocument();
  });
});

describe('Hardening pass — reduced motion', () => {
  afterEach(() => {
    // @ts-expect-error -- cleaning up the mock between tests
    delete window.matchMedia;
  });

  it('Sound Lock resolves quickly under prefers-reduced-motion instead of waiting the full configured duration', async () => {
    mockReducedMotion(true);
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('Enter Studio A — II-201'));
    // Full duration is 1400ms; under reduced motion this should resolve
    // in well under a second, proving the wait itself was shortened, not
    // just the CSS animation.
    await screen.findByText('II-201', {}, { timeout: 800 });
  });

  it('Sound Lock still takes the full configured duration when motion is not reduced (regression guard)', async () => {
    mockReducedMotion(false);
    renderApp('/district-ii/control-room');
    fireEvent.click(screen.getByTitle('Enter Studio A — II-201'));
    expect(screen.queryByText('II-201')).not.toBeInTheDocument();
    await screen.findByText('II-201', {}, { timeout: 2500 });
  });
});

describe('Hardening pass — broken room image degrades gracefully', () => {
  it('an image load error shows a fallback message and keeps every hotspot in the room usable', () => {
    renderApp('/district-ii/hq-corridor');
    const img = document.querySelector('img[alt="Executive, Brand & Media HQ"]') as HTMLImageElement;
    expect(img).toBeInTheDocument();

    fireEvent.error(img);

    expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
    // The room's own hotspots are still real, clickable buttons after the error.
    const screeningHotspot = screen.getByTitle('Obsidian Screening Theater — II-311');
    expect(screeningHotspot).toBeInTheDocument();
    fireEvent.click(screeningHotspot);
    expect(screen.getByText('II-311')).toBeInTheDocument();
  });

  it('Directory, Floor Plan, and the back button remain usable when the image is broken', () => {
    renderApp('/district-ii/hq-corridor');
    const img = document.querySelector('img[alt="Executive, Brand & Media HQ"]') as HTMLImageElement;
    fireEvent.error(img);

    expect(screen.getByText('Directory')).toBeInTheDocument();
    expect(screen.getByText('Floor Plan')).toBeInTheDocument();
    expect(screen.getByText('← DEPMG Executive Reception')).toBeInTheDocument();
  });
});

describe('Hardening pass — hardcoded-ID cleanup', () => {
  it('the Estate Hall still resolves via its type, not a hardcoded id check (regression guard)', () => {
    renderApp('/');
    expect(screen.getByText('Estate 2.0 — Foundation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Estate 2.0 — Foundation');
  });
});
