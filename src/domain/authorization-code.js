module.exports = class AuthorizationCode {
  constructor(sub, client_id, redirect_uri) {
    this.client_id = client_id;
    this.sub = sub;
    this.redirect_uri = redirect_uri;

    // A maximum authorization code lifetime of 10 minutes is RECOMMENDED.
    this.expires_at = new Date(Date.now() + 6000).toISOString();
  }

  toJSON = () => {
    return {
      id: this.id,
      sub: this.sub,
      client_id: this.client_id,
      expires_at: this.expires_at,
      redirect_uri: this.redirect_uri,
    };
  };
};
