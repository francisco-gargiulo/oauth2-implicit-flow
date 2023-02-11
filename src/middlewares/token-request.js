const TokenError = require("../errors/token-error");

/**
 * Access token request
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3}
 *
 */
module.exports = function ({ body }, res, next) {
  try {
    if (!body.grant_type) {
      throw new TokenError("invalid_request", "grant_type is required");
    }

    if (!body.code) {
      throw new TokenError("invalid_request", "code is required");
    }

    next();
  } catch (error) {
    console.log(error);

    next(error);
  }
};
