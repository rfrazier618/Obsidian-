import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';

/**
 * The one test file allowed to mock checkGeminiPassword — every other
 * District III test proves real behavior against the real, unmodified
 * gate (wrong password, already-admitted pass-through). This file exists
 * only because nobody outside DEPMG knows this month's real plaintext
 * password, and the migration was never meant to depend on knowing it:
 * admission.test.ts already proves checkGeminiPassword's hash comparison
 * against a password this suite DOES know. What's proven here is
 * everything downstream of a real "true" result — grantAdmission
 * actually runs (unmocked), the rhythm reveal plays, and the guest lands
 * on Main Floor — using the real component, real Registry destination,
 * real CommerceContext, mocking only the one comparison that would
 * otherwise require the real secret.
 */
vi.mock('@/registry/admission', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/registry/admission')>();
  return { ...actual, checkGeminiPassword: vi.fn().mockResolvedValue(true) };
});

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

describe('District III — a fresh, correct admission end to end', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockReducedMotion(true);
  });

  afterEach(() => {
    // @ts-expect-error -- cleaning up the mock between tests
    delete window.matchMedia;
    window.localStorage.clear();
  });

  it('plays Welcome home → rhythm → Enjoy your evening, persists real admission, and lands on Main Floor', async () => {
    renderApp('/district-iii/reception');
    fireEvent.click(screen.getByTitle('Enter Password'));

    const input = await screen.findByLabelText('Password');
    fireEvent.change(input, { target: { value: 'whatever-the-mock-accepts-anything' } });
    fireEvent.click(screen.getByText('Speak'));

    await screen.findByText('Welcome home.');
    await screen.findByText('Enjoy your evening.');

    await waitFor(() => expect(screen.getByText('Gemini Main Floor')).toBeInTheDocument(), { timeout: 3000 });

    const now = new Date();
    expect(window.localStorage.getItem('estate2.admission.gemini-reception')).toBe(
      `${now.getFullYear()}-${now.getMonth()}`
    );
  });
});
