export interface ApiErrorShape {
  error: true;
  message: string;
  statusCode: number;
}

/** Normalized error thrown by the api client - every service/hook can
 * rely on `.message` existing regardless of what the backend sent. */
export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";
