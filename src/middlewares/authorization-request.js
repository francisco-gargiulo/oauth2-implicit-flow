const AuthorizationError = require("../errors/authorization-error");

/**
 * Authorization request
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1}
 *
 */
module.exports = function (
  { query: { response_type, client_id, redirect_uri, scope, state }, session },
  res,
  next
) {
  try {
    if (!response_type) {
      throw new AuthorizationError(
        "invalid_request",
        "response_type is required",
        "http://localhost:3000/error"
      );
    }

    if (!client_id) {
      throw new AuthorizationError(
        "invalid_request",
        "client_id is required",
        "http://localhost:3000/error"
      );
    }

    /**
     * The client MUST ignore unrecognized response parameters.
     */
    session.params = {
      response_type,
      client_id,
      redirect_uri,
      scope,
      state,
    };

    next();
  } catch (error) {
    console.log(error);

    next(error);
  }
};
