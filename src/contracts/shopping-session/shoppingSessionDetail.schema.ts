import { z } from "zod";

import type { ShoppingSessionDetailDto } from "./shoppingSessionDetail.dto";
import { ShoppingSessionItemDtoSchema } from "./shoppingSessionItem.schema";
import { ShoppingSessionSummaryDtoSchema } from "./shoppingSessionSummary.schema";

export const ShoppingSessionDetailDtoSchema = ShoppingSessionSummaryDtoSchema.extend(
  {
    items: z.array(ShoppingSessionItemDtoSchema),
  },
).strict() satisfies z.ZodType<ShoppingSessionDetailDto>;
