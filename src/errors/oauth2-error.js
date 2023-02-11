module.exports = class OAuth2Error extends Error {
  constructor(code, description, status) {
    super(description);

    this.status = status || 500;
    this.code = code || "server_error";
    this.description = description;
  }
};
