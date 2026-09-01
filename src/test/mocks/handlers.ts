import { http, HttpResponse } from "msw";

import type { ShoppingSessionDto } from "@/contracts/shopping-session/shoppingSession.dto";

export const activeSessionDto: ShoppingSessionDto = {
  id: "a8ce1536-5e15-4dd4-8880-3be5e5ecff91",
  name: "Compras do mês",
  status: "ACTIVE",
  itemCount: 6,
  total: 184.7,
  createdAt: "2026-08-28T22:30:00.000Z",
};

export const createdSessionDto: ShoppingSessionDto = {
  id: "72a61fba-00d5-4d02-a6f7-0d73baeb4e40",
  name: "Compra 31/08/2026",
  status: "ACTIVE",
  itemCount: 0,
  total: 0,
  createdAt: "2026-08-31T15:00:00.000Z",
};

export const handlers = [
  http.get("http://localhost/api/bff/sessions", () =>
    HttpResponse.json([activeSessionDto]),
  ),
  http.post("http://localhost/api/bff/sessions", () =>
    HttpResponse.json(createdSessionDto, { status: 201 }),
  ),
  http.get("http://localhost/api/bff/sessions/:sessionId", ({ params }) => {
    if (params.sessionId !== activeSessionDto.id) {
      return HttpResponse.json({ code: "SESSION_NOT_FOUND" }, { status: 404 });
    }

    return HttpResponse.json(activeSessionDto);
  }),
];
