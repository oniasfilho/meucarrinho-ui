import { z } from "zod";

import type {
  CreateShoppingSessionRequestDto,
  ShoppingSessionDto,
} from "./shoppingSession.dto";

export const ShoppingSessionDtoSchema: z.ZodType<ShoppingSessionDto> = z
  .object({
    id: z.uuid(),
    name: z.string().trim().min(1).max(120),
    status: z.enum(["ACTIVE", "COMPLETED"]),
    itemCount: z.number().int().nonnegative(),
    total: z.number().nonnegative(),
    createdAt: z.iso.datetime(),
  })
  .strict();

export const ShoppingSessionListDtoSchema: z.ZodType<ShoppingSessionDto[]> =
  z.array(ShoppingSessionDtoSchema);

export const CreateShoppingSessionRequestDtoSchema: z.ZodType<CreateShoppingSessionRequestDto> =
  z.object({
    name: z.string(),
  });
