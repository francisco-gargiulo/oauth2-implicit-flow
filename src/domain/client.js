/**
 * Client
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-2 | Client Registration}
 *
 */
module.exports = class Client {
  constructor(client) {
    this.id = client.id;
    this.type = client.type;
    this.redirect_uri = client.redirect_uri;
    this.secret = client.secret;
  }

  toJSON = () => {
    return {
      id: this.id,
      type: this.type,
      redirect_uri: this.redirect_uri,
      secret: this.secret,
    };
  };
};
