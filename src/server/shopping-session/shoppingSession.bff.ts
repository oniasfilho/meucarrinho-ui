import "server-only";

import type {
  CreateShoppingSessionRequestDto,
  ShoppingSessionDto,
} from "@/contracts/shopping-session/shoppingSession.dto";

import { create, findById, list } from "./fakeShoppingSessionRepository";

export class FakeBffUnavailableError extends Error {
  override readonly name = "FakeBffUnavailableError";
}

async function delay(): Promise<void> {
  const configuredDelay = Number(process.env.FAKE_BFF_DELAY_MS);
  const delayMs =
    Number.isFinite(configuredDelay) && configuredDelay >= 0
      ? configuredDelay
      : 0;

  if (delayMs === 0) {
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function listShoppingSessions(): Promise<ShoppingSessionDto[]> {
  await delay();

  switch (process.env.FAKE_BFF_LIST_SCENARIO) {
    case "empty":
      return [];
    case "error":
      throw new FakeBffUnavailableError("The fake BFF is unavailable.");
    case "success":
    default:
      return list();
  }
}

export async function createShoppingSession(
  input: CreateShoppingSessionRequestDto,
): Promise<ShoppingSessionDto> {
  await delay();

  if (process.env.FAKE_BFF_CREATE_SCENARIO === "error") {
    throw new FakeBffUnavailableError("The fake BFF is unavailable.");
  }

  return create(input);
}

export async function getShoppingSession(
  sessionId: string,
): Promise<ShoppingSessionDto | undefined> {
  await delay();

  return findById(sessionId);
}
