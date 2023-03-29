module.exports = class Token {
  constructor(token) {
    this.access_token = token.access_token;
    this.token_type = token.token_type;
    this.expires_in = token.expires_in;
    this.sub = token.sub;
    this.client_id = token.client_id;
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
