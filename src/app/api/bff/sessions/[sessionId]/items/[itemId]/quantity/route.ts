import { UpdateItemQuantityRequestDtoSchema } from "@/contracts/shopping-session/shoppingSession.requests";
import { apiErrorToBffResponse } from "@/server/http/bffResponse";
import { updateShoppingSessionItemQuantity } from "@/server/shopping-session/shoppingSession.bff";

export const dynamic = "force-dynamic";

function invalidRequestResponse(): Response {
  return Response.json({ code: "INVALID_REQUEST" }, { status: 400 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sessionId: string; itemId: string }> },
): Promise<Response> {
  const { sessionId, itemId } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return invalidRequestResponse();
  }

  const result = UpdateItemQuantityRequestDtoSchema.safeParse(body);

  if (!result.success) {
    return invalidRequestResponse();
  }

  try {
    const session = await updateShoppingSessionItemQuantity(
      sessionId,
      itemId,
      result.data,
    );

    return Response.json(session, { status: 200 });
  } catch (error) {
    return apiErrorToBffResponse(error);
  }
}
