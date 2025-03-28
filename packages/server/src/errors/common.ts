export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message ?? "You don't have the necessary permissions");
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message ?? "Something went wrong. Please, try again later");
  }
}
