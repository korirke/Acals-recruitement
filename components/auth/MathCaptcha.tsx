"use client";

import { MutableRefObject, useRef, useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useMathCaptcha } from "@/hooks/useMathCaptcha";


export interface MathCaptchaHandle {
  verify: () => boolean;
  reset: () => void;
}

interface MathCaptchaProps {
  onVerified:  (verified: boolean) => void;
  captchaRef:  MutableRefObject<MathCaptchaHandle | null>;
  error?:      string | null;
}

const SHAKE_CSS = `
  @keyframes _captcha_shake {
    0%,100% { transform: translateX(0)   rotate(0deg);    }
    15%     { transform: translateX(-7px) rotate(-1.2deg); }
    30%     { transform: translateX(6px)  rotate(1.2deg);  }
    45%     { transform: translateX(-5px) rotate(-0.8deg); }
    60%     { transform: translateX(5px)  rotate(0.8deg);  }
    75%     { transform: translateX(-3px) rotate(-0.4deg); }
    90%     { transform: translateX(2px);                  }
  }
  ._captcha_shake {
    animation: _captcha_shake 0.55s cubic-bezier(.36,.07,.19,.97) both;
  }
`;

export function MathCaptcha({
  onVerified,
  captchaRef,
  error: externalError,
}: MathCaptchaProps) {
  const {
    question, answer, setAnswer,
    verified, error, verify, reset,
  } = useMathCaptcha();

  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Expose handle to parent ── */
  if (captchaRef) {
    captchaRef.current = {
      verify: () => {
        const ok = verify();
        onVerified(ok);
        if (!ok) triggerShake();
        return ok;
      },
      reset: () => {
        reset();
        onVerified(false);
      },
    };
  }

  /* ── Shake helper ── */
  function triggerShake() {
    setShaking(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShaking(true));
    });
    setTimeout(() => setShaking(false), 600);
  }

  /* ── Seamless auto-verify on every keystroke ── */
  function handleChange(raw: string) {
    setAnswer(raw);
    if (!question || !raw) return;

    if (raw.length >= question.digits) {
      const ok = verify(raw);
      onVerified(ok);

      if (ok) {
        inputRef.current?.blur(); 
      } else {
        triggerShake();
      }
    }
  }

  /* ── Refresh ── */
  function handleRefresh() {
    reset();
    onVerified(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const showError = externalError || error;

  /* ─────────────────────────── render ───────────────────────── */
  return (
    <>
      {/* Inject shake keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: SHAKE_CSS }} />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Verification
        </label>

        {/* ── Outer card ── */}
        <div
          className={[
            "rounded-lg border p-4 transition-all duration-200",
            verified
              ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
              : showError
              ? "border-red-300  bg-red-50  dark:border-red-700  dark:bg-red-950/30"
              : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50",
          ].join(" ")}
        >

          {/* ── Verified state ── */}
          {verified ? (
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">Verified — you&apos;re human!</span>
            </div>

          ) : (
            /* ── Question state ── */
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Solve this simple math question to continue:
              </p>

              <div className="flex items-center gap-3">

                {/* Question pill */}
                <div className="
                  flex items-center justify-center rounded-md border
                  border-neutral-200 bg-white px-4 py-2
                  font-mono text-base font-bold text-neutral-800
                  select-none
                  dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100
                ">
                  {question?.display}&nbsp;= ?
                </div>

                {/* Answer input — the star of the show */}
                <input
                  ref={inputRef}
                  type="number"
                  value={answer}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="?"
                  autoComplete="off"
                  autoFocus
                  className={[
                    // base
                    "w-20 rounded-md border bg-white px-3 py-2",
                    "text-center font-mono text-base font-bold text-neutral-800",
                    "outline-none transition-colors duration-150",
                    "focus:ring-2 focus:ring-primary-500/20",
                    "dark:bg-neutral-900 dark:text-neutral-100",
                    // hide browser number spinner
                    "[appearance:textfield]",
                    "[&::-webkit-outer-spin-button]:appearance-none",
                    "[&::-webkit-inner-spin-button]:appearance-none",
                    // dynamic: shake / normal / error border
                    shaking
                      ? "_captcha_shake border-red-400 bg-red-50/60 dark:border-red-500 dark:bg-red-950/30"
                      : showError
                      ? "border-red-300 dark:border-red-600 focus:border-red-400"
                      : "border-neutral-200 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-400",
                  ].join(" ")}
                />

                {/* Refresh */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  title="New question"
                  className="
                    rounded-md p-2 text-neutral-400 transition-colors
                    hover:bg-neutral-100 hover:text-neutral-600
                    dark:hover:bg-neutral-700 dark:hover:text-neutral-300
                  "
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Error message ── */}
        {showError && !verified && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{showError}</span>
          </div>
        )}
      </div>
    </>
  );
}
