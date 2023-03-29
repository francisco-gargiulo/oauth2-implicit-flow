const OAuth2Error = require("./oauth2Error");

/**
 * `DefaultError`
 */
module.exports = class DefaultError extends OAuth2Error {
  constructor() {
    const status = 400;
    const code = "invalid_request";
    const description = "Invalid Request";

    super(code, description, status);

    this.name = "DefaultError";
  }
};
