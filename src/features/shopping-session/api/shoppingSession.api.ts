import {
  ShoppingSessionDtoSchema,
  ShoppingSessionListDtoSchema,
} from "@/contracts/shopping-session/shoppingSession.schema";
import { baseApi } from "@/shared/api/baseApi";

import { mapShoppingSessionDto } from "../model/shoppingSession.mapper";
import type {
  CreateShoppingSessionInput,
  ShoppingSession,
  ShoppingSessionId,
} from "../model/shoppingSession.types";

const shoppingSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<ShoppingSession[], void>({
      query: () => "/sessions",
      transformResponse: (response: unknown) => {
        const dtos = ShoppingSessionListDtoSchema.parse(response);

        return dtos.map(mapShoppingSessionDto);
      },
      providesTags: (sessions) => [
        { type: "ShoppingSession", id: "LIST" },
        ...(sessions ?? []).map(({ id }) => ({
          type: "ShoppingSession" as const,
          id,
        })),
      ],
    }),
    getSession: builder.query<ShoppingSession, ShoppingSessionId>({
      query: (sessionId) => `/sessions/${sessionId}`,
      transformResponse: (response: unknown) => {
        const dto = ShoppingSessionDtoSchema.parse(response);

        return mapShoppingSessionDto(dto);
      },
      providesTags: (_session, _error, sessionId) => [
        { type: "ShoppingSession", id: sessionId },
      ],
    }),
    createSession: builder.mutation<
      ShoppingSession,
      CreateShoppingSessionInput
    >({
      query: ({ name }) => ({
        url: "/sessions",
        method: "POST",
        body: { name },
      }),
      transformResponse: (response: unknown) => {
        const dto = ShoppingSessionDtoSchema.parse(response);

        return mapShoppingSessionDto(dto);
      },
      invalidatesTags: [{ type: "ShoppingSession", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetSessionQuery,
  useCreateSessionMutation,
} = shoppingSessionApi;
