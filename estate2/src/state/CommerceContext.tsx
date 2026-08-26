import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * CommercePanel's state shell — item → quantity → cart → fulfillment →
 * status. Foundation phase only proves the domain is owned in one place
 * and survives navigation; Gemini's real fulfillment rules (bar pickup
 * vs. lounge delivery) and the other 4 domains the audit found outside
 * Orion (Piano requests, Vinyl sessions, Cigar concierge, Wine
 * reservations) layer their own rules on top of this during migration.
 */
export interface CartLine {
  id: string;
  destinationId: string;
  label: string;
  quantity: number;
}

interface CommerceState {
  cart: CartLine[];
  addItem: (line: Omit<CartLine, 'quantity'>) => void;
  removeItem: (id: string) => void;
}

const CommerceContext = createContext<CommerceState | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);

  const addItem = useCallback((line: Omit<CartLine, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (existing) {
        return prev.map((l) => (l.id === line.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { ...line, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const value = useMemo<CommerceState>(() => ({ cart, addItem, removeItem }), [cart, addItem, removeItem]);

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce(): CommerceState {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error('useCommerce must be used within CommerceProvider');
  return ctx;
}
