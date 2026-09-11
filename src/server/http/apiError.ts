import "server-only";

import {
  type ProblemDetail,
  ProblemDetailSchema,
} from "@/contracts/shopping-session/shoppingSession.problem";

export class ApiError extends Error {
  readonly status: number;
  readonly title?: string | undefined;
  readonly detail?: string | undefined;
  readonly instance?: string | undefined;
  readonly errors?: Record<string, string> | undefined;

  constructor(status: number, problem: ProblemDetail) {
    super(
      problem.detail ??
        problem.title ??
        `Backend request failed with status ${status}`,
    );

    this.name = "ApiError";
    this.status = status;
    this.title = problem.title;
    this.detail = problem.detail;
    this.instance = problem.instance;
    this.errors = problem.errors;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let problem: ProblemDetail = {};

    try {
      const body: unknown = await response.json();
      const parsed = ProblemDetailSchema.safeParse(body);

      if (parsed.success) {
        problem = parsed.data;
      }
    } catch {
      // The backend didn't return a JSON ProblemDetail body — fall back to the status alone.
    }

    return new ApiError(response.status, problem);
  }
}
