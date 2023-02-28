const AuthorizationCode = require("../domain/authorization-code");
const Repository = require("../repository");

// Create a new Repository instance for the "code" collection
const codeRepository = new Repository("code");

// Define a function that issues a new authorization code
function issueCode(user_sub, client_id, redirect_uri) {
  // Create a new AuthorizationCode instance with the provided user subject, client ID, and redirect URI
  const authorizationCode = new AuthorizationCode(
    user_sub,
    client_id,
    redirect_uri
  );

  // Add the authorization code to the code repository and return its ID
  return codeRepository.create(authorizationCode.toJSON());
}

// Define a function that finds an authorization code by its ID
function findCode(id) {
  // Find the authorization code with the given ID in the code repository
  const authorizationCode = codeRepository.findById(id);

  // Return the authorization code
  return authorizationCode;
}

module.exports = {
  issueCode,
  findCode,
};
