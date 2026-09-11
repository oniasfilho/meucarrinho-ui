import { z } from "zod";

import type { ShoppingSessionSummaryDto } from "./shoppingSessionSummary.dto";

export const ShoppingSessionSummaryDtoSchema = z
  .object({
    id: z.uuid(),
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
