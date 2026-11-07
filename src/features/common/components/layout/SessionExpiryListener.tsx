"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SESSION_EXPIRED_EVENT } from "../../http/httpClient";

/** Escucha los 401 del cliente HTTP y lleva al usuario al login. */
export function SessionExpiryListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onExpired = () => {
      if (pathname.startsWith("/login")) return;
      router.replace(`/login?expired=1&next=${encodeURIComponent(pathname)}`);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [pathname, router]);

  return null;
}
