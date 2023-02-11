const { randomBytes } = require("crypto");

module.exports = class Token {
  constructor(sub, client_id) {
    this.access_token = randomBytes(4).toString("hex");
    this.token_type = "Bearer";
    this.expires_in = 3600;
    this.sub = sub;
    this.client_id = client_id;
  }

  toJSON = () => {
    return {
      id: this.id,
      access_token: this.access_token,
      token_type: this.token_type,
      expires_in: this.expires_in,
      sub: this.sub,
      client_id: this.client_id,
    };
  };
};
