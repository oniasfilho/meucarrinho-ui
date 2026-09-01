"use client";

import { useRef } from "react";
import { Provider } from "react-redux";

import { type AppStore, makeStore } from "@/shared/store/makeStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = makeStore();
  }

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>;
}
