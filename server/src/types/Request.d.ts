export {};

declare global {
  namespace Express {
    interface Request {
      validated?: unknown;
      user?: unknown;
    }
  }
}
