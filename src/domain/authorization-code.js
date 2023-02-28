// Define a class called AuthorizationCode
module.exports = class AuthorizationCode {
  constructor(sub, client_id, redirect_uri) {
    this.client_id = client_id; // Set the client ID property to the provided client ID
    this.sub = sub; // Set the sub (subject) property to the provided sub
    this.redirect_uri = redirect_uri; // Set the redirect URI property to the provided redirect URI

    // Set the authorization code's expiration time to 10 minutes from the current time
    // This value is in ISO 8601 format and is stored as a string
    // Note: the 10-minute expiration time is a recommendation, not a requirement
    this.expires_at = new Date(Date.now() + 6000).toISOString();
  }

  // Define a toJSON method that returns an object representation of the AuthorizationCode instance
  toJSON = () => {
    return {
      id: this.id, // The authorization code ID is not included, as it is not set by the constructor
      sub: this.sub, // Include the sub (subject) property
      client_id: this.client_id, // Include the client ID property
      expires_at: this.expires_at, // Include the expiration time property
      redirect_uri: this.redirect_uri, // Include the redirect URI property
    };
  };
};
