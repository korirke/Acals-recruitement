"use client";

import { KeyboardEvent, MutableRefObject } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useMathCaptcha } from "@/hooks/useMathCaptcha";

export interface MathCaptchaHandle {
  verify: () => boolean;
  reset: () => void;
}

interface MathCaptchaProps {
  onVerified: (verified: boolean) => void;
  captchaRef: MutableRefObject<MathCaptchaHandle | null>;
  error?: string | null;
}

export function MathCaptcha({ onVerified, captchaRef, error: externalError }: MathCaptchaProps) {
  const { question, answer, setAnswer, verified, error, verify, reset } = useMathCaptcha();

  // Expose verify/reset to parent via ref
  if (captchaRef) {
    captchaRef.current = {
      verify: () => {
        const ok = verify();
        onVerified(ok);
        return ok;
      },
      reset: () => {
        reset();
        onVerified(false);
      },
    };
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const ok = verify();
      onVerified(ok);
    }
  };

  const handleRefresh = () => {
    reset();
    onVerified(false);
  };

  const showError = externalError || error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Human Verification
      </label>

      <div
        className={`
          rounded-lg border p-4 transition-all
          ${verified
            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
            : showError
            ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
            : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50"
          }
        `}
      >
        {verified ? (
          /* ── Verified State ── */
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Verified — you're human!</span>
          </div>
        ) : (
          /* ── Question State ── */
          <div className="space-y-3">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Solve this simple math question to continue:
            </p>

            <div className="flex items-center gap-3">
              {/* Question pill */}
              <div className="flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 font-mono text-base font-bold text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 select-none">
                {question?.display} = ?
              </div>

              {/* Answer input */}
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="?"
                className="
                  w-20 rounded-md border border-neutral-200 bg-white px-3 py-2
                  text-center font-mono text-base font-bold text-neutral-800
                  outline-none transition-all
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                  dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100
                  dark:focus:border-primary-400
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                "
              />

              {/* Refresh button */}
              <button
                type="button"
                onClick={handleRefresh}
                title="Get a new question"
                className="
                  rounded-md p-2 text-neutral-400 transition-colors
                  hover:bg-neutral-100 hover:text-neutral-600
                  dark:hover:bg-neutral-700 dark:hover:text-neutral-300
                "
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Check button */}
            {answer && (
              <button
                type="button"
                onClick={() => {
                  const ok = verify();
                  onVerified(ok);
                }}
                className="
                  text-xs font-semibold text-primary-500
                  hover:text-primary-600 underline-offset-2 hover:underline
                  transition-colors
                "
              >
                Check answer →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {showError && !verified && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{showError}</span>
        </div>
      )}
    </div>
  );
}