const basicAuth = require("../services/authentication/basic");
const bearerAuth = require("../services/authentication/bearer");

function decodeCredentials(credentials) {
  const [username, password] = Buffer.from(credentials, "base64")
    .toString()
    .split(":");

  return {
    username,
    password,
  };
}

function getCredentials({ authorization }) {
  if (!authorization) {
    throw new Error("Authorization header not found");
  }

  const [type, value] = authorization.split(" ");

  switch (type) {
    case "Bearer":
      return {
        type,
        token: value,
      };
    case "Basic":
      return {
        type,
        credentials: decodeCredentials(value),
      };
    default:
      throw new Error("Invalid authentication scheme");
  }
}

function getRealm(baseUrl) {
  switch (baseUrl) {
    case "/login":
      return "user";
    case "/userinfo":
      return "user";
    case "/token":
      return "client";
    default:
      return;
  }
}

function auth({ type, token, credentials }, realm) {
  switch (type) {
    case "Bearer":
      return bearerAuth(token, realm);
    case "Basic":
      return basicAuth(credentials, realm);
    default:
      throw new Error("invalid authentication scheme");
  }
}

module.exports = function authUser(req, res, next) {
  try {
    const credentials = getCredentials(req.headers);
    const realm = getRealm(req.baseUrl);

    req.session[realm] = auth(credentials, realm);

    next();
  } catch (error) {
    console.log(error);

    next(error);
  }
};
