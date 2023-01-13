// Extends JS Error class to customize return message and status.

class ExpressError extends Error {
  constructor(message, status){
    super();
    this.message = message;
    this.status = status;
  };
};

// 400- Extends ExpressError class to return BadRequestError.

class BadRequestError extends ExpressError{
  constructor(message = "Bad Request"){
  super(message, 403)};
};

// 401- Extends ExpressError class to return UnauthorizedError.

class UnauthorizedError extends ExpressError{
  constructor(message = "Unauthorized to complete request."){
  super(message, 401)};
};

// 404- Extends ExpressError class to return NotFoundError.

class NotFoundError extends ExpressError{
  constructor(message = "Not Found."){
  super(message, 404)};
};

module.exports = {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError
};