const OAuth2Error = require("./oauth2-error");

/**
 * `TokenError`
 */
module.exports = class TokenError extends OAuth2Error {
  constructor(code, description) {
    let status;

    switch (code) {
      case "invalid_request":
        status = 400;
        break;
      case "invalid_client":
        status = 401;
        break;
      case "invalid_grant":
        status = 403;
        break;
      case "unauthorized_client":
        status = 403;
        break;
      case "unsupported_grant_type":
        status = 400;
        break;
      case "invalid_scope":
        status = 400;
        break;
    }

    super(code, description, status);

    this.name = "TokenError";
  }
};
