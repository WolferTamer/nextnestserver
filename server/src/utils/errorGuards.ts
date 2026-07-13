import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";

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
  type?: ErrTypes; // Optional type for categorizing errors
};

export enum ErrTypes {
  NOTFOUND,
  UNIQUEVIOLATION,
  FOREIGNVIOLATION,
  CONTSTRAINVIOLATION,
  NULLVIOLATION,
  VALIDATIONERROR,
  GENERICPRISMA,
}

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

export function parsePrismaError(error: unknown): Err {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2001")
      return {
        [ERR]: true,
        error: `The object does not exist`,
        type: ErrTypes.NOTFOUND,
      };
    if (error.code === "P2002")
      return {
        [ERR]: true,
        error: `The field ${error.meta!.target} was not unique`,
        type: ErrTypes.UNIQUEVIOLATION,
      };
    if (error.code === "P2003")
      return {
        [ERR]: true,
        error: `The foreign key ${error.meta!.target} does not exist`,
        type: ErrTypes.FOREIGNVIOLATION,
      };
    if (error.code === "P2004")
      return {
        [ERR]: true,
        error: `The field ${error.meta!.target} violated a constraint`,
        type: ErrTypes.CONTSTRAINVIOLATION,
      };
    if (error.code === "P2007")
      return {
        [ERR]: true,
        error: `The field ${error.meta!.target} was not valid`,
        type: ErrTypes.VALIDATIONERROR,
      };
    if (error.code === "P2011")
      return {
        [ERR]: true,
        error: `The field ${error.meta!.target} was null`,
        type: ErrTypes.NULLVIOLATION,
      };
    return {
      [ERR]: true,
      error: error.message,
      type: ErrTypes.GENERICPRISMA,
    };
  } else if (error instanceof PrismaClientValidationError) {
    return {
      [ERR]: true,
      error: error.message,
      type: ErrTypes.VALIDATIONERROR,
    };
  } else if (isErrorWithMessage(error)) {
    return {
      [ERR]: true,
      error: error.message,
      type: ErrTypes.GENERICPRISMA,
    };
  } else {
    return {
      [ERR]: true,
      error: "Unkown error",
      type: ErrTypes.GENERICPRISMA,
    };
  }
}
