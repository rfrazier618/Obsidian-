import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, within } from '@testing-library/react';
import { CommerceProvider, useCommerce } from './CommerceContext';

/**
 * Direct proof of the shared commerce engine District III's whole
 * architecture rests on: one cart array, lines separated only by
 * `fulfillmentContext`, status advancing on the real per-profile
 * interval from registry/commerce.ts — exercised here without going
 * through the full Menu/Order UI so the timer-driven status machine can
 * be tested deterministically with fake timers.
 */
function Harness({ context }: { context: string }) {
  const { linesFor, addItem, placeOrder } = useCommerce();
  const lines = linesFor(context);
  return (
    <div data-testid={`harness-${context}`}>
      <button onClick={() => addItem(context, 'gemini-speakeasy', 'Gemini Speakeasy')}>add</button>
      <button onClick={() => placeOrder(context)}>place</button>
      <ul>
        {lines.map((l) => (
          <li key={l.id}>
            {l.name} x{l.quantity} — {l.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderHarness(contexts: string[]) {
  return render(
    <CommerceProvider>
      {contexts.map((c) => (
        <Harness key={c} context={c} />
      ))}
    </CommerceProvider>
  );
}

describe('CommerceContext — one shared engine, configuration-driven fulfillment', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('cart lines added under different fulfillment contexts stay separated without a second cart implementation', async () => {
    const { getByTestId } = renderHarness(['gemini-bar', 'mintaka']);
    const barHarness = within(getByTestId('harness-gemini-bar'));
    const mintakaHarness = within(getByTestId('harness-mintaka'));

    await act(async () => barHarness.getByText('add').click());
    expect(barHarness.getByText(/Gemini Speakeasy x1/)).toBeInTheDocument();
    expect(mintakaHarness.queryByText(/Gemini Speakeasy/)).not.toBeInTheDocument();

    await act(async () => mintakaHarness.getByText('add').click());
    expect(mintakaHarness.getByText(/Gemini Speakeasy x1/)).toBeInTheDocument();
    // still exactly one bar line, not two — proves the two contexts share
    // the underlying array without cross-contaminating each other's lines
    expect(barHarness.getAllByText(/Gemini Speakeasy/)).toHaveLength(1);
  });

  it('placeOrder(gemini-bar) advances through the real 4-step BAR PICKUP flow to COLLECTED', async () => {
    vi.useFakeTimers();
    const { getByTestId } = renderHarness(['gemini-bar']);
    const bar = within(getByTestId('harness-gemini-bar'));

    await act(async () => bar.getByText('add').click());
    await act(async () => bar.getByText('place').click());
    expect(bar.getByText(/ORDER RECEIVED/)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600);
    });
    expect(bar.getByText(/IN PREPARATION/)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600);
    });
    expect(bar.getByText(/READY AT BAR/)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600);
    });
    expect(bar.getByText(/COLLECTED/)).toBeInTheDocument();

    // final status — no further advance past the last step
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600);
    });
    expect(bar.getByText(/COLLECTED/)).toBeInTheDocument();
  });

  it("placeOrder(mintaka) advances through the real 5-step LOUNGE DELIVERY flow to DELIVERED", async () => {
    vi.useFakeTimers();
    const { getByTestId } = renderHarness(['mintaka']);
    const mintaka = within(getByTestId('harness-mintaka'));

    await act(async () => mintaka.getByText('add').click());
    await act(async () => mintaka.getByText('place').click());
    expect(mintaka.getByText(/ORDER RECEIVED/)).toBeInTheDocument();

    for (const expected of ['IN PREPARATION', 'PARTIALLY READY', 'OUT FOR SERVICE', 'DELIVERED']) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2600);
      });
      expect(mintaka.getByText(new RegExp(expected))).toBeInTheDocument();
    }
  });

  it('cart persists to localStorage and survives a remount (reload equivalent)', async () => {
    const first = renderHarness(['gemini-bar']);
    await act(async () => within(first.getByTestId('harness-gemini-bar')).getByText('add').click());
    first.unmount();

    const second = renderHarness(['gemini-bar']);
    expect(within(second.getByTestId('harness-gemini-bar')).getByText(/Gemini Speakeasy x1/)).toBeInTheDocument();
  });
});
