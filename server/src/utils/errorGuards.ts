export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}
export const ERR = Symbol("ERR");

export type Err = {
  [ERR]: true;
  error: string;
  type?: string; // Optional type for categorizing errors
};

export function isErr(error: unknown): error is Err {
  return (
    typeof error === "object" &&
    error !== null &&
    ERR in error &&
    error[ERR] == true &&
    "error" in error &&
    typeof error.error === "string"
  );
}
