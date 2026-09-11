import { apiErrorToBffResponse } from "@/server/http/bffResponse";
import { getShoppingSession } from "@/server/shopping-session/shoppingSession.bff";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<Response> {
  const { sessionId } = await params;

  try {
    const session = await getShoppingSession(sessionId);

    return Response.json(session, { status: 200 });
  } catch (error) {
    return apiErrorToBffResponse(error);
  }
}
