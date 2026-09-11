import "server-only";

import { ApiError } from "./apiError";

const STATUS_CODE_MAP: Record<number, string> = {
  400: "INVALID_REQUEST",
  404: "NOT_FOUND",
  409: "CONFLICT",
};

function codeForStatus(status: number): string {
  return (
    STATUS_CODE_MAP[status] ??
    (status >= 500 ? "INTERNAL_ERROR" : "UPSTREAM_UNAVAILABLE")
  );
}

export function apiErrorToBffResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      {
        code: codeForStatus(error.status),
        message: error.detail ?? error.message,
        ...(error.errors ? { errors: error.errors } : {}),
      },
      { status: error.status },
    );
  }

  return Response.json(
    {
      code: "UPSTREAM_UNAVAILABLE",
      message: "The backend service is unavailable.",
    },
    { status: 503 },
  );
}
