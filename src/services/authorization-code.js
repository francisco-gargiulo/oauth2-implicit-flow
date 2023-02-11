const AuthorizationCode = require("../domain/authorization-code");
const Repository = require("../repository");

const codeRepository = new Repository("code");

function issueCode(user_sub, client_id, redirect_uri) {
  const authorizationCode = new AuthorizationCode(
    user_sub,
    client_id,
    redirect_uri
  );

  return codeRepository.create(authorizationCode.toJSON());
}

function findCode(id) {
  const authorizationCode = codeRepository.findById(id);

  return authorizationCode;
}

module.exports = {
  issueCode,
  findCode,
};
