import { CreateShoppingSessionItemRequestDtoSchema } from "@/contracts/shopping-session/shoppingSession.requests";
import { apiErrorToBffResponse } from "@/server/http/bffResponse";
import { createShoppingSessionItem } from "@/server/shopping-session/shoppingSession.bff";

export const dynamic = "force-dynamic";

function invalidRequestResponse(): Response {
  return Response.json({ code: "INVALID_REQUEST" }, { status: 400 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<Response> {
  const { sessionId } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return invalidRequestResponse();
  }

  const result = CreateShoppingSessionItemRequestDtoSchema.safeParse(body);

  if (!result.success) {
    return invalidRequestResponse();
  }

  try {
    const session = await createShoppingSessionItem(sessionId, result.data);

    return Response.json(session, { status: 201 });
  } catch (error) {
    return apiErrorToBffResponse(error);
  }
}
