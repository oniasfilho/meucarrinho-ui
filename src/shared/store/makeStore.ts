import { configureStore, isPlain } from "@reduxjs/toolkit";

import { baseApi } from "@/shared/api/baseApi";

function isSerializable(value: unknown): boolean {
  return value instanceof Date || isPlain(value);
}

function getEntries(value: unknown): [string, unknown][] {
  if (value instanceof Date) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>);
}

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          isSerializable,
          getEntries,
        },
      }).concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
