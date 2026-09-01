import type { AdmissionConfig } from './types';

/**
 * District III's real credential gate — SHA-256 over the trimmed,
 * lowercased guess, compared against the configured month's hash. Ported
 * verbatim from legacy's `window.geminiHash`, same algorithm, same
 * normalization, so a password that worked in Estate 1.0 works here too.
 */
export async function geminiHash(word: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(word).trim().toLowerCase()));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * `monthIndex` is injectable (defaults to the real current month) purely
 * so this is testable without waiting for a real calendar month to prove
 * both a pass and a fail — the gate itself always uses the real clock.
 */
export async function checkGeminiPassword(
  said: string,
  config: AdmissionConfig,
  monthIndex: number = new Date().getMonth()
): Promise<boolean> {
  const trimmed = said.trim();
  if (!trimmed) return false;
  try {
    const hash = await geminiHash(trimmed);
    return hash === config.monthlyKeyHashes[monthIndex];
  } catch {
    return false;
  }
}

/** The non-interactive rhythm sequence for the current month — cosmetic, never checked. */
export function currentGeminiRhythm(config: AdmissionConfig, monthIndex: number = new Date().getMonth()): number[] {
  return config.monthlyRhythms[monthIndex] ?? [];
}

/**
 * Persisted admission, scoped to the calendar month — matching legacy's
 * `oe-gemini-admitted` behavior exactly: admitted once this month, no
 * further gate until the month rolls over, at which point it's as if it
 * never happened. `date` is injectable for the same testability reason
 * as `monthIndex` above.
 */
function monthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function storageKey(gateId: string): string {
  return `estate2.admission.${gateId}`;
}

export function isAdmitted(gateId: string, date: Date = new Date()): boolean {
  try {
    return window.localStorage.getItem(storageKey(gateId)) === monthKey(date);
  } catch {
    return false;
  }
}

export function grantAdmission(gateId: string, date: Date = new Date()): void {
  try {
    window.localStorage.setItem(storageKey(gateId), monthKey(date));
  } catch {
    // Same honest-fallback posture as the rest of the Estate: a blocked
    // localStorage means admission simply doesn't persist this visit,
    // not a crash.
  }
}
