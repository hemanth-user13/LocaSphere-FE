import { useCallback, useEffect, useState } from "react";

/** Seconds-based countdown, e.g. for "Resend code in 0:24". */
export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const restart = useCallback((seconds = initialSeconds) => setRemaining(seconds), [initialSeconds]);

  return { remaining, isDone: remaining <= 0, restart };
}
