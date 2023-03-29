const jwt = require("jsonwebtoken");

const Repository = require("../repository");
const Token = require("../domain/token");

const tokenRepository = new Repository("token");

function issueToken(sub, email, nickname) {
  if (!sub) {
    throw new Error("sub required");
  }

  const entity = tokenRepository.create({
    access_token: jwt.sign({ sub, email, nickname }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }),
    token_type: "Bearer",
    expires_in: 3600,
  });

  return new Token(entity);
}

function findTokenByAccessToken(accessToken) {
  let token;
  try {
    const entity = tokenRepository.findOne({ access_token: accessToken });

    token = new Token(entity);
  } catch (error) {
    console.error(error);
  }

  return token;
}

module.exports = {
  issueToken,
  findTokenByAccessToken,
};
