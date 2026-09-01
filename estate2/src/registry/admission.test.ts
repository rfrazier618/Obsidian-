import { describe, it, expect, beforeEach } from 'vitest';
import { geminiHash, checkGeminiPassword, currentGeminiRhythm, isAdmitted, grantAdmission } from './admission';
import type { AdmissionConfig } from './types';

/**
 * Pure-logic proof for the admission gate, independent of legacy's real
 * secret monthly passwords (which this migration never needed to know —
 * only their SHA-256 digests, already ported into the Registry). A
 * config built from a hash of a KNOWN test word here proves the same
 * mechanism legacy's real GEMINI_KEYS runs on.
 */
async function configFor(word: string, monthIndex = 0): Promise<AdmissionConfig> {
  const hash = await geminiHash(word);
  const hashes = Array(12).fill('unreachable-hash-placeholder');
  hashes[monthIndex] = hash;
  const rhythms: number[][] = Array(12).fill([1, 2, 3, 4]);
  return { targetId: 'gemini-hall', eyebrow: 'Test Gate', motto: 'Test Motto', monthlyKeyHashes: hashes, monthlyRhythms: rhythms };
}

describe('registry/admission — the real, failable District III gate', () => {
  it('geminiHash normalizes (trim + lowercase) before hashing, matching legacy exactly', async () => {
    const a = await geminiHash('  Starlight  ');
    const b = await geminiHash('starlight');
    expect(a).toBe(b);
  });

  it('checkGeminiPassword accepts the correct word for the configured month', async () => {
    const config = await configFor('constellation', 3);
    await expect(checkGeminiPassword('constellation', config, 3)).resolves.toBe(true);
    await expect(checkGeminiPassword('Constellation', config, 3)).resolves.toBe(true); // case-insensitive
    await expect(checkGeminiPassword('  constellation  ', config, 3)).resolves.toBe(true); // trims
  });

  it('checkGeminiPassword rejects a wrong word', async () => {
    const config = await configFor('constellation', 3);
    await expect(checkGeminiPassword('wrongword', config, 3)).resolves.toBe(false);
  });

  it("checkGeminiPassword rejects the right word for the wrong month — rotation is real, not cosmetic", async () => {
    const config = await configFor('constellation', 3);
    await expect(checkGeminiPassword('constellation', config, 4)).resolves.toBe(false);
  });

  it('checkGeminiPassword rejects an empty guess without hashing', async () => {
    const config = await configFor('constellation', 0);
    await expect(checkGeminiPassword('   ', config, 0)).resolves.toBe(false);
  });

  it('currentGeminiRhythm returns the configured month\'s cosmetic sequence', async () => {
    const config = await configFor('x', 0);
    config.monthlyRhythms[5] = [4, 1, 3, 2];
    expect(currentGeminiRhythm(config, 5)).toEqual([4, 1, 3, 2]);
  });

  describe('isAdmitted / grantAdmission — persisted, scoped to the calendar month', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('starts not admitted', () => {
      expect(isAdmitted('gemini-reception')).toBe(false);
    });

    it('grantAdmission persists admission for the current month', () => {
      const now = new Date(2026, 8, 1); // September 2026
      grantAdmission('gemini-reception', now);
      expect(isAdmitted('gemini-reception', now)).toBe(true);
    });

    it('admission does not carry over to a different month', () => {
      grantAdmission('gemini-reception', new Date(2026, 8, 1));
      expect(isAdmitted('gemini-reception', new Date(2026, 9, 1))).toBe(false);
    });

    it('admission is scoped per gate id — one gate\'s grant does not satisfy another\'s', () => {
      const now = new Date(2026, 8, 1);
      grantAdmission('gemini-reception', now);
      expect(isAdmitted('some-other-gate', now)).toBe(false);
    });
  });
});
