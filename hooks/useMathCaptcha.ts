import { useState, useEffect, useCallback } from "react";

type Operation = "+" | "-" | "×";

interface CaptchaQuestion {
  a: number;
  b: number;
  op: Operation;
  result: number;
  display: string;
}

interface UseMathCaptchaReturn {
  question: CaptchaQuestion | null;
  answer: string;
  setAnswer: (val: string) => void;
  verified: boolean;
  error: string | null;
  verify: () => boolean;
  reset: () => void;
}

function generateQuestion(): CaptchaQuestion {
  const ops: Operation[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, result: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 40) + 5;
    b = Math.floor(Math.random() * 40) + 5;
    result = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 40) + 20;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    result = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    result = a * b;
  }

  return { a, b, op, result, display: `${a} ${op} ${b}` };
}

export function useMathCaptcha(): UseMathCaptchaReturn {
  const [question, setQuestion] = useState<CaptchaQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setQuestion(generateQuestion());
    setAnswer("");
    setVerified(false);
    setError(null);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  const verify = useCallback((): boolean => {
    if (!question) return false;
    if (parseInt(answer, 10) === question.result) {
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