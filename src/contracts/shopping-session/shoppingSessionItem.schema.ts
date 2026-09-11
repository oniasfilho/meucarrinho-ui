import { z } from "zod";

import type { ShoppingSessionItemDto } from "./shoppingSessionItem.dto";

export const ShoppingSessionItemDtoSchema: z.ZodType<ShoppingSessionItemDto> =
  z
    .object({
      // See shoppingSessionSummary.schema.ts: seed data uses non-RFC-4122 ids.
      id: z.guid(),
      name: z.string().min(1),
      unitPrice: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      note: z.string().nullable(),
      labelPhotoKey: z.string().nullable(),
      labelPhotoUrl: z.string().nullable(),
      createdAt: z.iso.datetime(),
      updatedAt: z.iso.datetime(),
    })
    .strict();
