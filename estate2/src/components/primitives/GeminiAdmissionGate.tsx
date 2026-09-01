import { useEffect, useRef, useState } from 'react';
import type { AdmissionConfig } from '@/registry/types';
import { checkGeminiPassword, currentGeminiRhythm, grantAdmission, isAdmitted } from '@/registry/admission';
import { usePreferences } from '@/state/PreferencesContext';
import { Overlay } from './Overlay';
import styles from './GeminiAdmissionGate.module.css';

interface GeminiAdmissionGateProps {
  open: boolean;
  onClose: () => void;
  /** The reception destination's own id — scopes the persisted admission
   *  state, so a second gate elsewhere in the Estate can't be satisfied
   *  by this one's grant. */
  gateId: string;
  config: AdmissionConfig;
  /** Called once admission is granted (fresh or already-standing) — the
   *  caller navigates to config.targetId itself, through the normal
   *  edge-transition-aware nav hook, the same as every other destination
   *  change in the Estate. */
  onComplete: () => void;
  /** Called on a wrong password, after the refusal beat plays. Legacy's
   *  real behavior: no retry-in-place, no attempt counter — the guest is
   *  shown out and would need to return to reception fresh to try again.
   *  Deliberately NOT the same shape as ThresholdKeypad's forgiving
   *  reset-in-place, because II-110 was never a real lock and this is. */
  onReject: () => void;
}

type Phase = 'greeting' | 'prompt' | 'checking' | 'wrong' | 'welcome' | 'rhythm' | 'closing';

const RHYTHM_GAPS_MS = [520, 300, 660, 380];

function wait(ms: number, cancelled: () => boolean): Promise<void> {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  }).then(() => {
    if (cancelled()) return Promise.reject(new Error('cancelled'));
  });
}

/**
 * A real, failable credential gate — ported from legacy's reception
 * hostess sequence (openReception/rcAskForPassword/rcSubmit). The
 * physical staging (hand reaching for a brass panel, a monitor overlay,
 * a door film) is out of scope for this reference slice; what's
 * preserved exactly is the state machine those visuals sat on top of:
 * an already-admitted guest passes without being asked again, a correct
 * password is hashed and checked against the current month's real key,
 * a wrong one gets one honest refusal and no retry-in-place, and the
 * non-interactive "rhythm" is staff choreography the guest only watches
 * — never a second credential to get right.
 */
export function GeminiAdmissionGate({ open, onClose, gateId, config, onComplete, onReject }: GeminiAdmissionGateProps) {
  const { prefersReducedMotion } = usePreferences();
  const [phase, setPhase] = useState<Phase>('greeting');
  const [said, setSaid] = useState('');
  const [wrongShake, setWrongShake] = useState(false);
  const [litCount, setLitCount] = useState(0);
  /** Captured once per open, before grantAdmission() can run — after that,
   *  isAdmitted() is true either way, so it can no longer tell "already
   *  had access" and "just earned it this trip" apart. */
  const [wasAlreadyAdmitted, setWasAlreadyAdmitted] = useState(false);
  const tokenRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scale = prefersReducedMotion ? 0.1 : 1;

  useEffect(() => {
    if (!open) return;
    const my = ++tokenRef.current;
    const cancelled = () => tokenRef.current !== my;
    setSaid('');
    setWrongShake(false);
    setLitCount(0);

    const admittedAlready = isAdmitted(gateId);
    setWasAlreadyAdmitted(admittedAlready);

    if (admittedAlready) {
      setPhase('welcome');
      wait(prefersReducedMotion ? 200 : 1400, cancelled)
        .then(() => {
          if (cancelled()) return;
          onComplete();
        })
        .catch(() => {});
      return;
    }

    setPhase('greeting');
    wait(prefersReducedMotion ? 150 : 1500, cancelled)
      .then(() => {
        if (cancelled()) return;
        setPhase('prompt');
        return wait(50, cancelled);
      })
      .then(() => {
        if (cancelled()) return;
        inputRef.current?.focus();
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, gateId]);

  const submit = async () => {
    if (phase !== 'prompt' || !said.trim()) return;
    const my = tokenRef.current;
    const cancelled = () => tokenRef.current !== my;
    setPhase('checking');

    const ok = await checkGeminiPassword(said, config);
    if (cancelled()) return;

    if (!ok) {
      setWrongShake(true);
      setPhase('wrong');
      try {
        await wait(prefersReducedMotion ? 300 : 3200, cancelled);
      } catch {
        return;
      }
      onReject();
      return;
    }

    grantAdmission(gateId);
    setPhase('welcome');
    try {
      await wait(prefersReducedMotion ? 150 : 1900, cancelled);
      if (cancelled()) return;

      setPhase('rhythm');
      const rhythm = currentGeminiRhythm(config);
      for (let i = 0; i < rhythm.length; i++) {
        setLitCount(i + 1);
        await wait(150 * scale, cancelled);
        await wait(RHYTHM_GAPS_MS[i % RHYTHM_GAPS_MS.length] * scale, cancelled);
      }

      await wait(prefersReducedMotion ? 200 : 2000, cancelled);
      if (cancelled()) return;
      setPhase('closing');
      await wait(prefersReducedMotion ? 200 : 2400, cancelled);
      if (cancelled()) return;
      onComplete();
    } catch {
      // navigation or unmount interrupted the sequence — nothing to clean up,
      // admission is already granted and persisted.
    }
  };

  const handleClose = () => {
    tokenRef.current++;
    onClose();
  };

  const rhythm = currentGeminiRhythm(config);

  return (
    <Overlay open={open} onClose={handleClose} ariaLabel={config.eyebrow} size="modal">
      <p className={styles.eyebrow}>{config.eyebrow}</p>
      <div className={styles.logo}>GEMINI</div>
      <p className={styles.motto}>{config.motto}</p>

      <div className={styles.stage} role="status" aria-live="polite">
        {phase === 'greeting' && <p className={styles.line}>Good evening.</p>}

        {phase === 'welcome' && (
          <p className={styles.line}>{wasAlreadyAdmitted ? 'Welcome back.' : 'Welcome home.'}</p>
        )}

        {(phase === 'prompt' || phase === 'checking' || phase === 'wrong') && (
          <>
            <p className={styles.line}>What&rsquo;s the password?</p>
            <input
              ref={inputRef}
              className={`${styles.input} ${wrongShake ? styles.wrong : ''}`}
              // Deliberately not type="password": this is a speakeasy
              // phrase, not a stored account credential, and Chrome's
              // password-manager UI (generate/save-password prompts) can
              // steal focus mid-keystroke on a real type="password" field
              // — confirmed live, not a jsdom-only concern. Masked the
              // same way visually via CSS text-security instead.
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              value={said}
              disabled={phase !== 'prompt'}
              onChange={(e) => {
                setSaid(e.target.value);
                setWrongShake(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              aria-label="Password"
            />
            <button
              type="button"
              className={styles.submit}
              onClick={submit}
              disabled={phase !== 'prompt' || !said.trim()}
            >
              Speak
            </button>
            {phase === 'wrong' && <p className={styles.line}>Then tonight isn&rsquo;t your night.</p>}
          </>
        )}

        {phase === 'rhythm' && (
          <div className={styles.rhythm} aria-hidden="true">
            {rhythm.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i < litCount ? styles.dotLit : ''}`} />
            ))}
          </div>
        )}

        {phase === 'closing' && <p className={styles.line}>Enjoy your evening.</p>}
      </div>
    </Overlay>
  );
}
