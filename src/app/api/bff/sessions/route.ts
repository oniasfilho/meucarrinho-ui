import { CreateShoppingSessionRequestDtoSchema } from "@/contracts/shopping-session/shoppingSession.requests";
import { apiErrorToBffResponse } from "@/server/http/bffResponse";
import {
  createShoppingSession,
  listShoppingSessions,
} from "@/server/shopping-session/shoppingSession.bff";

export const dynamic = "force-dynamic";

function invalidRequestResponse(): Response {
  return Response.json({ code: "INVALID_REQUEST" }, { status: 400 });
}

export async function GET(): Promise<Response> {
  try {
    const sessions = await listShoppingSessions();

    return Response.json(sessions, { status: 200 });
  } catch (error) {
    return apiErrorToBffResponse(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return invalidRequestResponse();
  }

  const result = CreateShoppingSessionRequestDtoSchema.safeParse(body);

  if (!result.success) {
    return invalidRequestResponse();
  }

  try {
    const session = await createShoppingSession(result.data);

    return Response.json(session, { status: 201 });
  } catch (error) {
    return apiErrorToBffResponse(error);
  }
}
