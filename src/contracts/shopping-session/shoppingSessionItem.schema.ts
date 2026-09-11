import { z } from "zod";

import type { ShoppingSessionItemDto } from "./shoppingSessionItem.dto";

export const ShoppingSessionItemDtoSchema: z.ZodType<ShoppingSessionItemDto> =
  z
    .object({
      id: z.uuid(),
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
