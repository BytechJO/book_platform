import { useCallback, useEffect, useMemo, useState } from "react";

const RATE_LIMIT_EVENT = "rate-limit-updated";
const RATE_LIMIT_MESSAGES = {
  "book-activation": "Too many book activation attempts.",
  "class-code": "Too many class code attempts.",
};

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return "anonymous";

  try {
    const encodedPayload = token.split(".")[1];
    const normalizedPayload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    const payload = JSON.parse(window.atob(paddedPayload));
    return payload.id || "anonymous";
  } catch {
    return "anonymous";
  }
};

const getRemainingSeconds = (lockUntil) =>
  Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));

export const formatRateLimitCountdown = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function useRateLimitCountdown(scope) {
  const storageKey = useMemo(
    () => `rateLimit:${getUserId()}:${scope}`,
    [scope],
  );
  const [lockUntil, setLockUntil] = useState(() => {
    const storedValue = Number(localStorage.getItem(storageKey));
    return Number.isFinite(storedValue) ? storedValue : 0;
  });
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(lockUntil),
  );

  const updateLock = useCallback(
    (nextLockUntil) => {
      if (nextLockUntil > Date.now()) {
        localStorage.setItem(storageKey, String(nextLockUntil));
      } else {
        localStorage.removeItem(storageKey);
      }

      setLockUntil(nextLockUntil);
      window.dispatchEvent(
        new CustomEvent(RATE_LIMIT_EVENT, {
          detail: { storageKey, lockUntil: nextLockUntil },
        }),
      );
    },
    [storageKey],
  );

  useEffect(() => {
    const handleRateLimitUpdate = (event) => {
      if (event.detail?.storageKey === storageKey) {
        setLockUntil(Number(event.detail.lockUntil) || 0);
      }
    };
    const handleStorageUpdate = (event) => {
      if (event.key === storageKey) {
        setLockUntil(Number(event.newValue) || 0);
      }
    };

    window.addEventListener(RATE_LIMIT_EVENT, handleRateLimitUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener(RATE_LIMIT_EVENT, handleRateLimitUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [storageKey]);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getRemainingSeconds(lockUntil);
      setRemainingSeconds(remaining);

      if (remaining === 0 && lockUntil) {
        updateLock(0);
      }
    };

    updateCountdown();
    if (!lockUntil) return undefined;

    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [lockUntil, updateLock]);

  const startFromError = useCallback(
    (error) => {
      if (error?.response?.status !== 429) return false;

      const retryAfterSeconds = Number(
        error.response?.data?.retry_after_seconds ||
          error.response?.headers?.["retry-after"] ||
          15 * 60,
      );
      const nextLockUntil = Date.now() + retryAfterSeconds * 1000;

      updateLock(nextLockUntil);
      setRemainingSeconds(retryAfterSeconds);
      return true;
    },
    [updateLock],
  );

  const countdown = formatRateLimitCountdown(remainingSeconds);

  return {
    isRateLimited: remainingSeconds > 0,
    remainingSeconds,
    countdown,
    message:
      remainingSeconds > 0
        ? `${RATE_LIMIT_MESSAGES[scope] || "Too many attempts."} Try again in ${countdown} (minutes:seconds).`
        : "",
    startFromError,
    clearRateLimit: () => updateLock(0),
  };
}
