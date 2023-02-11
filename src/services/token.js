const Repository = require("../repository");
const Token = require("../domain/token");

const tokenRepository = new Repository("token");

function issueToken(user, client) {
  const token = new Token(user.sub, client.id);

  return tokenRepository.create(token.toJSON());
}

function findTokenByAccessToken(access_token) {
  const token = tokenRepository.findOne({ access_token });

  return token;
}

module.exports = {
  issueToken,
  findTokenByAccessToken,
};
