import createError from 'http-errors';

/**
 * Middleware to create an HTTP error
 * 
 * @param {object} req - user request
 * @param {object} res - server response
 * @param {function} next - continue to the next middleware
*/
const httpCreateError = (req, res, next) => {
  next(createError(404));
};

/**
 * Middleware to handle the HTTP error
 * 
 * @param {object} err - the error
 * @param {object} req - user request
 * @param {object} res - server response
 * @param {function} next - continue to the next middleware
*/
const httpErrorHandler = (err, req, res, next) => {
  let status;
  let jsonResponse = {
    status: 404,
    message: 'Not found',
    details: {
      errors: [],
    },
  };
  if (err) {
    status = err.status || 404;
    jsonResponse = {
      ...jsonResponse,
      ...err,
      status,
      details: {
        ...jsonResponse.details,
        errors: [ err ],
      },
    };
  } else {
    status = status || 500;
    jsonResponse = {
      ...jsonResponse,
      status,
      message: 'Something wrong happened',
      details: {
        ...jsonResponse.details,
        errors: [ err ],
      },
    };
  }
  return res.status(status).json(jsonResponse);
}

export {
  httpCreateError,
  httpErrorHandler,
};
