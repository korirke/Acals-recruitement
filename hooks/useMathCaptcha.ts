import { useState, useEffect, useCallback } from "react";

type Operation = "+" | "-" | "×";

interface CaptchaQuestion {
  a: number;
  b: number;
  op: Operation;
  result: number;
  display: string;
  /** pre-computed digit count of the correct answer */
  digits: number;
}

interface UseMathCaptchaReturn {
  question: CaptchaQuestion | null;
  answer: string;
  setAnswer: (val: string) => void;
  verified: boolean;
  error: string | null;
  /**
   * Pass `overrideValue` to avoid stale-closure issues when calling
   * immediately after setAnswer (before React re-render).
   */
  verify: (overrideValue?: string) => boolean;
  reset: () => void;
}

function generateQuestion(): CaptchaQuestion {
  const ops: Operation[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, result: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 40) + 5;   // 5 – 44
    b = Math.floor(Math.random() * 40) + 5;
    result = a + b;                             // 10 – 88  (2 digits)
  } else if (op === "-") {
    a = Math.floor(Math.random() * 40) + 20;   // 20 – 59
    b = Math.floor(Math.random() * (a - 1)) + 1;
    result = a - b;                             // 1 – 58   (1–2 digits)
  } else {
    a = Math.floor(Math.random() * 8) + 2;     // 2 – 9  (cap at 9 to avoid 3-digit edge)
    b = Math.floor(Math.random() * 8) + 2;
    result = a * b;                             // 4 – 81   (1–2 digits)
  }

  return {
    a, b, op, result,
    display: `${a} ${op} ${b}`,
    digits: String(result).length,
  };
}

export function useMathCaptcha(): UseMathCaptchaReturn {
  const [question, setQuestion] = useState<CaptchaQuestion | null>(null);
  const [answer, setAnswer]     = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const reset = useCallback(() => {
    setQuestion(generateQuestion());
    setAnswer("");
    setVerified(false);
    setError(null);
  }, []);

  useEffect(() => { reset(); }, [reset]);

  /**
   * Core verification.
   * `overrideValue` lets callers pass the fresh input string directly,
   * bypassing the stale `answer` in the closure.
   */
  const verify = useCallback((overrideValue?: string): boolean => {
    if (!question) return false;
    const val = overrideValue !== undefined ? overrideValue : answer;

    if (parseInt(val, 10) === question.result) {
      setVerified(true);
      setError(null);
      return true;
    }

    setError("Wrong answer — try this new one");
    setQuestion(generateQuestion());
    setAnswer("");
    return false;
  }, [answer, question]);

  return { question, answer, setAnswer, verified, error, verify, reset };
}
