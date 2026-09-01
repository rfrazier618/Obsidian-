import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getFulfillmentProfile } from '@/registry/commerce';

/**
 * The one shared commerce engine District III's architectural test is
 * built around: Gemini Main Bar and Mintaka are NOT two carts. They are
 * one cart array, with each line tagged by `fulfillmentContext` (the
 * ordering room's own Registry id — 'gemini-bar' or 'mintaka') and every
 * status rule looked up from `registry/commerce.ts`'s FULFILLMENT_PROFILES
 * by that same id. A future fifth domain (Piano requests, Wine
 * reservations, ...) adds a profile, not a new context/provider.
 *
 * Matches legacy's real `orionCart` behavior: persisted to localStorage
 * (so it survives navigation and reload — see the reference slice's
 * required "reload/state rules" and "navigation away/back" tests), and
 * once placed, a line's status auto-advances on a real interval timer
 * rather than jumping straight to the final state.
 */
export interface CartLine {
  id: string;
  itemId: string;
  name: string;
  fulfillmentContext: string;
  quantity: number;
  /** 'cart' = not yet submitted. Otherwise one of that context's FulfillmentProfile.steps. */
  status: 'cart' | string;
}

const STORAGE_KEY = 'estate2.commerce.cart';

function loadCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Same honest-fallback posture as admission: a blocked localStorage
    // means the cart simply doesn't persist this visit, not a crash.
  }
}

interface CommerceState {
  cart: CartLine[];
  /** All lines for one fulfillment context (a room's own id) — how a room's
   *  Order UI reads only its own cart out of the shared array. */
  linesFor: (fulfillmentContext: string) => CartLine[];
  addItem: (fulfillmentContext: string, itemId: string, name: string) => void;
  removeItem: (id: string) => void;
  /** Submits every 'cart'-status line in this context: moves them to that
   *  context's FulfillmentProfile.steps[0] and starts the auto-advance timer. */
  placeOrder: (fulfillmentContext: string) => void;
}

const CommerceContext = createContext<CommerceState | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => loadCart());
  const timers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((t) => clearInterval(t));
      active.clear();
    };
  }, []);

  const linesFor = useCallback(
    (fulfillmentContext: string) => cart.filter((l) => l.fulfillmentContext === fulfillmentContext),
    [cart]
  );

  const addItem = useCallback((fulfillmentContext: string, itemId: string, name: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (l) => l.itemId === itemId && l.fulfillmentContext === fulfillmentContext && l.status === 'cart'
      );
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [
        ...prev,
        {
          id: `${fulfillmentContext}:${itemId}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
          itemId,
          name,
          fulfillmentContext,
          quantity: 1,
          status: 'cart',
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearTimer = useCallback((lineId: string) => {
    const t = timers.current.get(lineId);
    if (t) {
      clearInterval(t);
      timers.current.delete(lineId);
    }
  }, []);

  const advance = useCallback(
    (lineId: string, fulfillmentContext: string) => {
      const profile = getFulfillmentProfile(fulfillmentContext);
      if (!profile) {
        clearTimer(lineId);
        return;
      }
      setCart((prev) => {
        let reachedFinal = false;
        const next = prev.map((l) => {
          if (l.id !== lineId) return l;
          const idx = profile.steps.indexOf(l.status);
          const nextIdx = idx + 1;
          if (nextIdx >= profile.steps.length) {
            reachedFinal = true;
            return l;
          }
          if (nextIdx === profile.steps.length - 1) reachedFinal = true;
          return { ...l, status: profile.steps[nextIdx] };
        });
        if (reachedFinal) queueMicrotask(() => clearTimer(lineId));
        return next;
      });
    },
    [clearTimer]
  );

  const placeOrder = useCallback(
    (fulfillmentContext: string) => {
      const profile = getFulfillmentProfile(fulfillmentContext);
      if (!profile) return;
      setCart((prev) => {
        const toSubmit = prev.filter((l) => l.fulfillmentContext === fulfillmentContext && l.status === 'cart');
        toSubmit.forEach((l) => {
          if (timers.current.has(l.id)) return;
          const timer = setInterval(() => advance(l.id, fulfillmentContext), profile.stepIntervalMs);
          timers.current.set(l.id, timer);
        });
        return prev.map((l) =>
          l.fulfillmentContext === fulfillmentContext && l.status === 'cart'
            ? { ...l, status: profile.steps[0] }
            : l
        );
      });
    },
    [advance]
  );

  const value = useMemo<CommerceState>(
    () => ({ cart, linesFor, addItem, removeItem, placeOrder }),
    [cart, linesFor, addItem, removeItem, placeOrder]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce(): CommerceState {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error('useCommerce must be used within CommerceProvider');
  return ctx;
}
