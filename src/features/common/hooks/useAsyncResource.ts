"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../http/apiError";

interface ResourceState<T> {
  key: string | null;
  data?: T;
  error?: string;
}

export interface AsyncResource<T> {
  data: T | undefined;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

/**
 * Carga datos de forma asíncrona y vuelve a pedirlos cada vez que cambia `key`.
 * Mientras llega la nueva respuesta conserva los datos anteriores.
 */
export function useAsyncResource<T>(loader: () => Promise<T>, key: string): AsyncResource<T> {
  const loaderRef = useRef(loader);
  const [state, setState] = useState<ResourceState<T>>({ key: null });
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${key}#${reloadCount}`;

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let isActive = true;
    loaderRef
      .current()
      .then((data) => {
        if (isActive) setState({ key: requestKey, data });
      })
      .catch((error: unknown) => {
        if (isActive) setState((previous) => ({ key: requestKey, data: previous.data, error: getErrorMessage(error) }));
      });
    return () => {
      isActive = false;
    };
  }, [requestKey]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const isLoading = state.key !== requestKey;

  return {
    data: state.data,
    error: isLoading ? null : (state.error ?? null),
    isLoading,
    reload,
  };
}
