export class SharedAssumptionsError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'SharedAssumptionsError';
    this.status = status;
    this.code = code;
  }
}

export const createSharedAssumptionsError = (status, code, message) => {
  return new SharedAssumptionsError(status, code, message);
};

export const isSharedAssumptionsError = (error) => {
  return error instanceof SharedAssumptionsError;
};
