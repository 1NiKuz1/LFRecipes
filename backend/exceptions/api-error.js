module.exports = class ApiError extends Error {
  status;
  error;

  constructor(status, message, error = null) {
    super(message);
    this.status = status;
    this.error = error;
  }

  static Error(status, message) {
    return new ApiError(status, message);
  }

  static BadRequest(status, message, error) {
    return new ApiError(status, message, error);
  }
};
