const router = require("express").Router();

const authenticate = require("../middlewares/authenticate");
const tokenRequest = require("../middlewares/token-request");

const TokenError = require("../errors/token-error");

const { issueToken } = require("../services/token");
const { findUserBySub } = require("../services/user");
const { findCode } = require("../services/authorization-code");

/**
 * Token endpoint
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.2}
 *
 */
router.post("/", [
  authenticate,
  tokenRequest,
  function ({ body, session: { client } }, res) {
    try {
      if (body.grant_type !== "authorization_code") {
        throw new TokenError(
          "unsupported_grant_type",
          "grant_type must be authorization_code"
        );
      }

      /**
       * Ensure that the authorization code was issued to the authenticated
       * confidential client, or if the client is public, ensure that the
       * code was issued to "client_id" in the request.
       */

      if (body.client_id !== client.id) {
        throw new TokenError("invalid_request", "invalid client_id");
      }

      const code = findCode(body.code);

      if (!code) {
        throw new TokenError("invalid_request", "code not found");
      }

      /**
       * - Ensure that the "redirect_uri" parameter is present if the
       *   "redirect_uri" parameter was included in the initial authorization
       *   request as described in Section 4.1.1, and if included ensure that
       *   their values are identical.
       */
      if (body.redirect_uri) {
        if (body.redirect_uri !== code.redirect_uri) {
          throw new TokenError("invalid_request", "invalid redirect_uri");
        }
      }

      const user = findUserBySub(code.sub);

      if (!user) {
        throw new TokenError("invalid_request", "user not found");
      }

      const token = issueToken(user, client);

      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Pragma", "no-store");

      res.json(token);
    } catch (error) {
      console.error(error);

      next(error);
    }
  },
]);

module.exports = router;
