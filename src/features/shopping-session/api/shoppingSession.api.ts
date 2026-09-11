import { z } from "zod";

import { ShoppingSessionDetailDtoSchema } from "@/contracts/shopping-session/shoppingSessionDetail.schema";
import { ShoppingSessionSummaryListDtoSchema } from "@/contracts/shopping-session/shoppingSessionSummary.schema";
import { baseApi } from "@/shared/api/baseApi";

import {
  mapShoppingSessionDetailDto,
  mapShoppingSessionSummaryDto,
} from "../model/shoppingSession.mapper";
import type {
  CreateShoppingSessionInput,
  UpdateItemQuantityInput,
} from "../model/shoppingSession.types";
import type { ShoppingSessionDetail } from "../model/shoppingSessionDetail.types";
import type {
  ShoppingSessionId,
  ShoppingSessionSummary,
} from "../model/shoppingSessionSummary.types";

// Workaround for a meucarrinho-api bug: ShoppingSessionService.create() saves the
// session entity but keeps using its stale in-memory reference instead of the one
// returned by the repository, so the @PrePersist-assigned createdAt never reaches
// the response and POST /sessions comes back with createdAt: null. A follow-up GET
// returns the real value. Remove this override once the backend fix lands.
const CreateShoppingSessionResponseDtoSchema = ShoppingSessionDetailDtoSchema.extend(
  {
    createdAt: z.iso.datetime().nullable(),
  },
);

const shoppingSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<ShoppingSessionSummary[], void>({
      query: () => "/sessions",
      transformResponse: (response: unknown) => {
        const dtos = ShoppingSessionSummaryListDtoSchema.parse(response);

        return dtos.map(mapShoppingSessionSummaryDto);
      },
      providesTags: (sessions) => [
        { type: "ShoppingSession", id: "LIST" },
        ...(sessions ?? []).map(({ id }) => ({
          type: "ShoppingSession" as const,
          id,
        })),
      ],
    }),
    getSession: builder.query<ShoppingSessionDetail, ShoppingSessionId>({
      query: (sessionId) => `/sessions/${sessionId}`,
      transformResponse: (response: unknown) => {
        const dto = ShoppingSessionDetailDtoSchema.parse(response);

        return mapShoppingSessionDetailDto(dto);
      },
      providesTags: (_session, _error, sessionId) => [
        { type: "ShoppingSession", id: sessionId },
      ],
    }),
    createSession: builder.mutation<
      ShoppingSessionDetail,
      CreateShoppingSessionInput
    >({
      query: ({ name }) => ({
        url: "/sessions",
        method: "POST",
        body: { name },
      }),
      transformResponse: (response: unknown) => {
        const dto = CreateShoppingSessionResponseDtoSchema.parse(response);

        return mapShoppingSessionDetailDto({
          ...dto,
          createdAt: dto.createdAt ?? new Date().toISOString(),
        });
      },
      invalidatesTags: [{ type: "ShoppingSession", id: "LIST" }],
    }),
    updateItemQuantity: builder.mutation<
      ShoppingSessionDetail,
      UpdateItemQuantityInput
    >({
      query: ({ sessionId, itemId, quantity }) => ({
        url: `/sessions/${sessionId}/items/${itemId}/quantity`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: unknown) => {
        const dto = ShoppingSessionDetailDtoSchema.parse(response);

        return mapShoppingSessionDetailDto(dto);
      },
      async onQueryStarted(
        { sessionId, itemId, quantity },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          shoppingSessionApi.util.updateQueryData(
            "getSession",
            sessionId,
            (draft) => {
              const item = draft.items.find((entry) => entry.id === itemId);

              if (!item) {
                return;
              }

              item.quantity = quantity;
              draft.itemCount = draft.items.reduce(
                (sum, entry) => sum + entry.quantity,
                0,
              );
              draft.total = draft.items.reduce(
                (sum, entry) => sum + entry.unitPrice * entry.quantity,
                0,
              );
              draft.remainingBudget =
                draft.budget === null ? null : draft.budget - draft.total;
              draft.overBudget =
                draft.budget !== null && draft.total > draft.budget;
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            shoppingSessionApi.util.updateQueryData(
              "getSession",
              sessionId,
              () => data,
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "ShoppingSession", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetSessionQuery,
  useCreateSessionMutation,
  useUpdateItemQuantityMutation,
} = shoppingSessionApi;
