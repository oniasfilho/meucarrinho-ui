import { CreateShoppingSessionRequestDtoSchema } from "@/contracts/shopping-session/shoppingSession.schema";
import {
  createShoppingSession,
  FakeBffUnavailableError,
  listShoppingSessions,
} from "@/server/shopping-session/shoppingSession.bff";

export const dynamic = "force-dynamic";

function invalidRequestResponse(): Response {
  return Response.json({ code: "INVALID_REQUEST" }, { status: 400 });
}

function unavailableResponse(): Response {
  return Response.json({ code: "BFF_UNAVAILABLE" }, { status: 503 });
}

export async function GET(): Promise<Response> {
  try {
    const sessions = await listShoppingSessions();

    return Response.json(sessions, { status: 200 });
  } catch (error) {
    if (error instanceof FakeBffUnavailableError) {
      return unavailableResponse();
    }

    throw error;
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
    if (error instanceof FakeBffUnavailableError) {
      return unavailableResponse();
    }

    throw error;
  }
}
