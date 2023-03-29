const OAuth2Error = require("./oauth2Error");

/**
 * AuthorizeError
 */
module.exports = class AuthorizeError extends OAuth2Error {
  constructor(code, description) {
    let status;

    switch (code) {
      case "invalid_request":
        status = 400;
        break;
      case "unauthorized_client":
        status = 403;
        break;
      case "access_denied":
        status = 403;
        break;
      case "unsupported_response_type":
        status = 400;
        break;
      case "invalid_scope":
        status = 400;
        break;
      case "temporarily_unavailable":
        status = 503;
        break;
    }

    super(code, description, status);

    this.name = "AuthorizeError";
  }
};
