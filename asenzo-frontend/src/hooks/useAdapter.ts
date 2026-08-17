import { useState, useCallback, useEffect } from "react";

export function useAdapter<T>(adapterFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [localData, setLocalData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
    });

    adapterFunction()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLocalData(res);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError((err as Error).message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [adapterFunction]);

  useEffect(() => {
    const cleanup = loadData();
    return cleanup;
  }, [loadData]);

  return {
    data,
    setData,
    localData,
    setLocalData,
    loading,
    error,
    reload: loadData,
  };
}
