import type { ReactElement } from "react";
import { Provider } from "react-redux";
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";

import { makeStore } from "@/shared/store/makeStore";

export function render(
  element: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const store = makeStore();
  const result = testingLibraryRender(
    <Provider store={store}>{element}</Provider>,
    options,
  );

  return { ...result, store };
}

export * from "@testing-library/react";
