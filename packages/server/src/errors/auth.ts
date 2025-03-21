export class ExpiredTokenError extends Error {
  constructor() {
    super("Token has expired");
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super("Invalid token");
  }
}

export class ExpiredCodeError extends Error {
  constructor() {
    super("Code has expired");
  }
}

export class InvalidCodeError extends Error {
  constructor() {
    super("Invalid code");
  }
}

export class UnverifiedEmailError extends Error {
  constructor() {
    super("Please, verify your email to login");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
  }
}
