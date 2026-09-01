import {
  FakeBffUnavailableError,
  getShoppingSession,
} from "@/server/shopping-session/shoppingSession.bff";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<Response> {
  const { sessionId } = await params;

  try {
    const session = await getShoppingSession(sessionId);

    if (!session) {
      return Response.json({ code: "SESSION_NOT_FOUND" }, { status: 404 });
    }

    return Response.json(session, { status: 200 });
  } catch (error) {
    if (error instanceof FakeBffUnavailableError) {
      return Response.json({ code: "BFF_UNAVAILABLE" }, { status: 503 });
    }

    throw error;
  }
}
