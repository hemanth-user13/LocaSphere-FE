import { useCallback, useEffect, useRef, useState } from "react";

type Status = "loading" | "success" | "error";

export type Resource<T> = {
  data: T | undefined;
  error: Error | undefined;
  status: Status;
  isLoading: boolean;
  isRefreshing: boolean;
  /** Pull-to-refresh: keeps current data visible while fetching. */
  refresh: () => Promise<void>;
  /** Full reload; pass `{ silent: true }` to skip the loading state. */
  reload: (opts?: { silent?: boolean }) => Promise<void>;
};

type State<T> = { data?: T; error?: Error; settledKey: string | null };

/**
 * Minimal async-data hook (loading / error / refresh). Shaped like
 * TanStack Query's API so it can be swapped for `useQuery` later.
 *
 * `deps` must be JSON-serialisable; the fetch re-runs when they change.
 * Loading is derived (the latest deps haven't settled yet) rather than set
 * synchronously, and previous data stays available while refetching.
 */
export function useResource<T>(fetcher: () => Promise<T>, deps: unknown[] = []): Resource<T> {
  const key = JSON.stringify(deps);
  const [state, setState] = useState<State<T>>({ settledKey: null });
  const [isRefreshing, setRefreshing] = useState(false);
  const requestId = useRef(0);
  const fetcherRef = useRef(fetcher);

  // Declared before the load effect so the latest fetcher is in place when it runs.
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const run = useCallback(async (forKey: string) => {
    const id = ++requestId.current;
    try {
      const data = await fetcherRef.current();
      if (id === requestId.current) setState({ data, error: undefined, settledKey: forKey });
    } catch (e) {
      if (id !== requestId.current) return;
      const error = e instanceof Error ? e : new Error("Something went wrong");
      setState((s) => ({ data: s.data, error, settledKey: forKey }));
    } finally {
      if (id === requestId.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    run(key);
  }, [key, run]);

  const status: Status = state.settledKey !== key ? "loading" : state.error ? "error" : "success";

  return {
    data: state.data,
    error: status === "error" ? state.error : undefined,
    status,
    isLoading: status === "loading",
    isRefreshing,
    refresh: () => {
      setRefreshing(true);
      return run(key);
    },
    reload: (opts) => {
      if (!opts?.silent) setState((s) => ({ ...s, settledKey: null }));
      return run(key);
    },
  };
}
