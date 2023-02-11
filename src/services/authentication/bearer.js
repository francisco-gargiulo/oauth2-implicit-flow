const { findUserBySub } = require("../user");
const { findTokenByAccessToken } = require("../token");

module.exports = function (access_token, realm) {
  if (realm !== "user") {
    throw new Error("Invalid realm");
  }

  verifyToken(access_token);

  const token = findTokenByAccessToken(access_token);
  const user = findUserBySub(token.sub);

  return user;
};

function verifyToken(token) {
  if (!token) {
    throw new Error("Invalid token");
  }
}
