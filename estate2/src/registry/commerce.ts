/**
 * Fulfillment profiles — the architectural point of the whole Gemini
 * slice. Legacy already proved this shape (one Orion cart engine, keyed
 * by `loungeId`, with `ORION_LOUNGE_NAMES` + `ORION_STATUS_STEPS` /
 * `ORION_STATUS_STEPS_BAR` deciding label and step count per lounge) —
 * this is that same "different fulfillment model expressed as
 * configuration atop one engine" idea, carried into the Registry-driven
 * shape the rest of Estate 2.0 already uses (see registry/transitions.ts'
 * EDGE_TRANSITIONS for the same pattern applied to Sound Lock).
 *
 * Keyed by fulfillment context id — which is simply the ordering
 * destination's own `id` (gemini-bar, mintaka). No separate lounge-id
 * concept was introduced; the room IS the context.
 *
 * Step labels are legacy's own literal strings (ORDER RECEIVED / IN
 * PREPARATION / ...), not a paraphrase. Note for the record: legacy's
 * real VIP flow is five steps (adds PARTIALLY READY and OUT FOR SERVICE
 * between preparation and delivered) — see the migration report for why
 * this reference slice preserves that instead of a shorter version.
 */
export interface FulfillmentProfile {
  /** e.g. "MINTAKA · LOUNGE DELIVERY" — matches legacy's orionFulfillmentLabel() exactly. */
  label: string;
  steps: string[];
  finalStatus: string;
  /** ms between automatic status advances once an order is placed — matches legacy's real 2600ms simulation interval. */
  stepIntervalMs: number;
}

export const FULFILLMENT_PROFILES: Record<string, FulfillmentProfile> = {
  'gemini-bar': {
    label: 'GEMINI MAIN BAR · BAR PICKUP',
    steps: ['ORDER RECEIVED', 'IN PREPARATION', 'READY AT BAR', 'COLLECTED'],
    finalStatus: 'COLLECTED',
    stepIntervalMs: 2600,
  },
  mintaka: {
    label: 'MINTAKA · LOUNGE DELIVERY',
    steps: ['ORDER RECEIVED', 'IN PREPARATION', 'PARTIALLY READY', 'OUT FOR SERVICE', 'DELIVERED'],
    finalStatus: 'DELIVERED',
    stepIntervalMs: 2600,
  },
};

export function getFulfillmentProfile(fulfillmentContext: string): FulfillmentProfile | null {
  return FULFILLMENT_PROFILES[fulfillmentContext] ?? null;
}
