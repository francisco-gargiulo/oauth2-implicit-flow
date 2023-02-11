const { findUserByEmail } = require("../user");
const { findClient } = require("../client");

/** Basic Auth
 *
 * {@link https://datatracker.ietf.org/doc/html/rfc7617 | The 'Basic' HTTP Authentication Scheme}
 */
module.exports = function ({ username, password }, realm) {
  if (!username || !password) {
    throw new Error("credentials are required");
  }

  if (!realm) {
    throw new Error("realm is required");
  }

  switch (realm) {
    case "client":
      return clientAuth(username, password);
    case "user":
      return userAuth(username, password);
    default:
      throw new Error("Invalid realm");
  }
};

function clientAuth(username, password) {
  const client = findClient(username);

  // TODO: Validate credentials

  return client;
}

function userAuth(username, password) {
  const user = findUserByEmail(username);

  // TODO: Validate credentials

  return user;
}
