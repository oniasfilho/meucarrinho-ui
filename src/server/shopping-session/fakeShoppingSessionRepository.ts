import "server-only";

import { randomUUID } from "node:crypto";

import type {
  CreateShoppingSessionRequestDto,
  ShoppingSessionDto,
} from "@/contracts/shopping-session/shoppingSession.dto";

const initialSessions: ShoppingSessionDto[] = [
  {
    id: "a8ce1536-5e15-4dd4-8880-3be5e5ecff91",
    name: "Compras do mês",
    status: "ACTIVE",
    itemCount: 6,
    total: 184.7,
    createdAt: "2026-08-28T22:30:00.000Z",
  },
  {
    id: "6441eb72-bb02-4f43-8919-205244f958cb",
    name: "Feira da semana",
    status: "ACTIVE",
    itemCount: 3,
    total: 72.35,
    createdAt: "2026-08-27T14:10:00.000Z",
  },
];

type FakeBffGlobal = typeof globalThis & {
  __meuCarrinhoFakeSessions?: Map<string, ShoppingSessionDto>;
};

const fakeGlobal = globalThis as FakeBffGlobal;

function getStore(): Map<string, ShoppingSessionDto> {
  fakeGlobal.__meuCarrinhoFakeSessions ??= new Map(
    initialSessions.map((session) => [session.id, session]),
  );

  return fakeGlobal.__meuCarrinhoFakeSessions;
}

export function list(): ShoppingSessionDto[] {
  return [...getStore().values()].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function findById(sessionId: string): ShoppingSessionDto | undefined {
  return getStore().get(sessionId);
}

export function create(
  input: CreateShoppingSessionRequestDto,
): ShoppingSessionDto {
  const session: ShoppingSessionDto = {
    id: randomUUID(),
    name: input.name,
    status: "ACTIVE",
    itemCount: 0,
    total: 0,
    createdAt: new Date().toISOString(),
  };

  getStore().set(session.id, session);

  return session;
}
