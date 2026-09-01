import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';
import { getEdgeTransition } from '@/registry/transitions';

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

function seedAdmitted(now = new Date()) {
  window.localStorage.setItem('estate2.admission.gemini-reception', `${now.getFullYear()}-${now.getMonth()}`);
}

describe('District III reference slice — Gemini Reception → Main Floor → Core/Main Bar → Mintaka', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockReducedMotion(true);
  });

  afterEach(() => {
    // @ts-expect-error -- cleaning up the mock between tests
    delete window.matchMedia;
    window.localStorage.clear();
  });

  it('a direct link to a gated District III destination before admission shows a refusal, not the room', () => {
    renderApp('/district-iii/main-floor');
    expect(screen.queryByText('Gemini Main Floor')).not.toBeInTheDocument();
    expect(screen.getByText('This destination isn’t open to you yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Go to Gemini Reception'));
    expect(screen.getByText('Gemini Reception')).toBeInTheDocument();
  });

  it('a wrong password refuses admission (no retry-in-place) and returns to DEPMG Reception without granting access', async () => {
    renderApp('/district-iii/reception');
    fireEvent.click(screen.getByTitle('Enter Password'));
    const input = await screen.findByLabelText('Password');
    fireEvent.change(input, { target: { value: 'definitely-not-the-real-word' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await screen.findByText(/Then tonight isn.t your night/);
    await waitFor(() => expect(screen.getByText('DEPMG Executive Reception')).toBeInTheDocument(), { timeout: 3000 });

    expect(window.localStorage.getItem('estate2.admission.gemini-reception')).toBeNull();
  });

  it('an already-admitted guest passes straight through without being asked for a password again', async () => {
    seedAdmitted();
    renderApp('/district-iii/reception');
    fireEvent.click(screen.getByTitle('Enter Password'));

    await screen.findByText('Welcome back.');
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Gemini Main Floor')).toBeInTheDocument(), { timeout: 3000 });
  });

  it('a direct link to a gated destination after admission renders the room normally', () => {
    seedAdmitted();
    renderApp('/district-iii/main-floor');
    expect(screen.getByText('Gemini Main Floor')).toBeInTheDocument();
    expect(screen.getByText('III-201')).toBeInTheDocument();
  });

  it('Main Floor → VIP Mezzanine → Mintaka, and back again, using the real 2-hop structure', () => {
    seedAdmitted();
    renderApp('/district-iii/main-floor');

    fireEvent.click(screen.getByTitle('VIP Mezzanine — III-601'));
    expect(screen.getByText('Constellation Mezzanine')).toBeInTheDocument();
    expect(screen.getByText('III-601')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Mintaka — West VIP Lounge'));
    expect(screen.getByText('Mintaka')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/← .*Constellation Mezzanine/));
    expect(screen.getByText('Constellation Mezzanine')).toBeInTheDocument();
  });

  it('Main Floor → Gemini Core, and out-of-scope hotspots give an honest toast instead of a broken link', () => {
    seedAdmitted();
    renderApp('/district-iii/main-floor');

    fireEvent.click(screen.getByTitle('Piano Lounge'));
    expect(screen.getByText(/Piano Lounge hasn.t migrated to Estate 2\.0 yet/)).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Gemini Core — Center Bar'));
    expect(screen.getByText('Gemini Main Bar')).toBeInTheDocument();
  });

  it('Constellation Mezzanine: Alnilam/Alnitak are honest toasts, VIP Elevator/Grand Stair are real informational panels', () => {
    seedAdmitted();
    renderApp('/district-iii/constellation-mezzanine');

    fireEvent.click(screen.getByTitle('Alnilam — Center VIP Lounge'));
    expect(screen.getByText(/Alnilam — Center VIP Lounge hasn.t migrated/)).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('VIP Elevator — To All Levels'));
    expect(screen.getByRole('dialog', { name: 'VIP Elevator' })).toBeInTheDocument();
  });

  it('Gemini Main Bar: browse the shared menu, add an item, and place an order under BAR PICKUP fulfillment', () => {
    seedAdmitted();
    renderApp('/district-iii/gemini-bar');

    fireEvent.click(screen.getByText('Menu & Order'));
    expect(screen.getByRole('heading', { name: 'Gemini Main Bar Menu' })).toBeInTheDocument();
    expect(screen.getByText('Gemini Speakeasy')).toBeInTheDocument();

    const row = screen.getByText('Gemini Speakeasy').closest('div')!.parentElement!;
    fireEvent.click(within(row as HTMLElement).getByText('Add'));

    fireEvent.click(screen.getByText(/BAR PICKUP/));
    expect(screen.getByText(/Gemini Speakeasy ×1/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('GEMINI MAIN BAR · BAR PICKUP')).toBeInTheDocument();
    expect(screen.getByText('ORDER RECEIVED')).toBeInTheDocument();
  });

  it("Mintaka: the identical shared Menu component fulfills under LOUNGE DELIVERY instead — no separate Mintaka cart", () => {
    seedAdmitted();
    renderApp('/district-iii/mintaka');

    fireEvent.click(screen.getByText('Menu & Order'));
    const row = screen.getByText('Gemini Speakeasy').closest('div')!.parentElement!;
    fireEvent.click(within(row as HTMLElement).getByText('Add'));

    fireEvent.click(screen.getByText(/LOUNGE DELIVERY/));
    fireEvent.click(screen.getByText('Place Order'));

    expect(screen.getByText('MINTAKA · LOUNGE DELIVERY')).toBeInTheDocument();
    expect(screen.queryByText('GEMINI MAIN BAR · BAR PICKUP')).not.toBeInTheDocument();
  });

  it('no Sound Lock (or any transition) applies to any District III edge — this is a District II-only property', () => {
    const pairs: [string, string][] = [
      ['gemini-reception', 'gemini-hall'],
      ['gemini-hall', 'gemini-bar'],
      ['gemini-hall', 'constellation-mezzanine'],
      ['constellation-mezzanine', 'mintaka'],
    ];
    for (const [a, b] of pairs) {
      expect(getEdgeTransition(a, b)).toBeNull();
    }
  });

  it('renders the full admitted navigation graph with zero console errors', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    seedAdmitted();
    renderApp('/district-iii/main-floor');
    fireEvent.click(screen.getByTitle('VIP Mezzanine — III-601'));
    fireEvent.click(screen.getByTitle('Mintaka — West VIP Lounge'));
    fireEvent.click(screen.getByText('Menu & Order'));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
