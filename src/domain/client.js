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
    this.secret = client.secret;
    this.redirect_uri = client.redirect_uri;
  }

  toJSON = () => {
    return {
      id: this.id,
      secret: this.secret,
      type: this.type,
      redirect_uri: this.redirect_uri,
    };
  };
};
