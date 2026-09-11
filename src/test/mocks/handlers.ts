import { http, HttpResponse } from "msw";

import type { ShoppingSessionDetailDto } from "@/contracts/shopping-session/shoppingSessionDetail.dto";
import type { ShoppingSessionSummaryDto } from "@/contracts/shopping-session/shoppingSessionSummary.dto";

export const activeSessionSummaryDto: ShoppingSessionSummaryDto = {
  id: "a8ce1536-5e15-4dd4-8880-3be5e5ecff91",
  name: "Compras do mês",
  storeName: null,
  budget: null,
  status: "ACTIVE",
  itemCount: 6,
  total: 184.7,
  remainingBudget: null,
  overBudget: false,
  createdAt: "2026-08-28T22:30:00.000Z",
  completedAt: null,
};

export const activeSessionDetailDto: ShoppingSessionDetailDto = {
  ...activeSessionSummaryDto,
  items: [],
};

export const createdSessionDetailDto: ShoppingSessionDetailDto = {
  id: "72a61fba-00d5-4d02-a6f7-0d73baeb4e40",
  name: "Compra 31/08/2026",
  storeName: null,
  budget: null,
  status: "ACTIVE",
  itemCount: 0,
  total: 0,
  remainingBudget: null,
  overBudget: false,
  createdAt: "2026-08-31T15:00:00.000Z",
  completedAt: null,
  items: [],
};

export const handlers = [
  http.get("http://localhost/api/bff/sessions", () =>
    HttpResponse.json([activeSessionSummaryDto]),
  ),
  http.post("http://localhost/api/bff/sessions", () =>
    HttpResponse.json(createdSessionDetailDto, { status: 201 }),
  ),
  http.get("http://localhost/api/bff/sessions/:sessionId", ({ params }) => {
    if (params.sessionId !== activeSessionDetailDto.id) {
      return HttpResponse.json({ code: "NOT_FOUND" }, { status: 404 });
    }

    return HttpResponse.json(activeSessionDetailDto);
  }),
];
