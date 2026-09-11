import { z } from "zod";

import type { ShoppingSessionSummaryDto } from "./shoppingSessionSummary.dto";

export const ShoppingSessionSummaryDtoSchema = z
  .object({
    // Postgres's uuid column accepts any UUID-shaped value, and this backend's
    // seed data uses non-RFC-4122 placeholder ids (e.g. "10000000-0000-...").
    // z.guid() checks shape only, without requiring a valid version/variant nibble.
    id: z.guid(),
    name: z.string().min(1),
    storeName: z.string().nullable(),
    budget: z.number().nullable(),
    status: z.enum(["ACTIVE", "COMPLETED"]),
    itemCount: z.number().int().nonnegative(),
    total: z.number().nonnegative(),
    remainingBudget: z.number().nullable(),
    overBudget: z.boolean(),
    createdAt: z.iso.datetime(),
    completedAt: z.iso.datetime().nullable(),
  })
  .strict() satisfies z.ZodType<ShoppingSessionSummaryDto>;

export const ShoppingSessionSummaryListDtoSchema: z.ZodType<
  ShoppingSessionSummaryDto[]
> = z.array(ShoppingSessionSummaryDtoSchema);
