import { z } from "zod";

export interface CreateShoppingSessionRequestDto {
  name: string;
  storeName?: string | null | undefined;
  budget?: number | null | undefined;
}

export const CreateShoppingSessionRequestDtoSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    storeName: z.string().trim().min(1).max(160).nullish(),
    budget: z.number().nonnegative().nullish(),
  })
  .strict() satisfies z.ZodType<CreateShoppingSessionRequestDto>;

export interface UpdateShoppingSessionRequestDto {
  name?: string | undefined;
  storeName?: string | null | undefined;
  budget?: number | null | undefined;
}

export interface CreateShoppingSessionItemRequestDto {
  name: string;
  unitPrice: number;
  quantity: number;
  note?: string | null | undefined;
}

export interface UpdateShoppingSessionItemRequestDto {
  name?: string | undefined;
  unitPrice?: number | undefined;
  quantity?: number | undefined;
  note?: string | null | undefined;
}

export interface UpdateItemQuantityRequestDto {
  quantity: number;
}

export const UpdateItemQuantityRequestDtoSchema = z
  .object({
    quantity: z.number().int().min(1),
  })
  .strict() satisfies z.ZodType<UpdateItemQuantityRequestDto>;
