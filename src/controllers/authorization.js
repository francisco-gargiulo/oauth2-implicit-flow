const router = require("express").Router();

const AuthorizationError = require("../errors/authorization-error");

const { findClient } = require("../services/client");
const { issueCode } = require("../services/authorization-code");

const authorizationRequest = require("../middlewares/authorization-request");
const ensureLogin = require("../middlewares/ensure-login");

/**
 * Authorization endpoint
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.1}
 *
 */
router.get("/", [
  authorizationRequest,
  ensureLogin,
  function ({ session: { params, user, ...session } }, res, next) {
    try {
      /**
       * Authorization code grant
       *
       * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.1}
       *
       */
      if (params.response_type !== "code") {
        throw new AuthorizationError(
          "unsupported_response_type",
          "response_type must be code",
          "http://localhost:3000/error"
        );
      }

      // TODO: find client
      const client = findClient(params.client_id);

      if (!client) {
        throw new AuthorizationError(
          "unauthorized_client",
          "invalid client_id",
          "http://localhost:3000/error"
        );
      }

      /**
       * Dynamic configuration
       *
       * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.1.2.3}
       *
       */
      if (Array.isArray(client.redirect_uri)) {
        if (!client.redirect_uri.includes(params.redirect_uri)) {
          throw new AuthorizationError(
            "unauthorized_client",
            "invalid redirect_uri",
            "http://localhost:3000/error"
          );
        }
      }

      /**
       * Redirection endpoint
       *
       * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.1.2}
       *
       */
      const redirectURL = new URL(
        Array.isArray(client.redirect_uri)
          ? params.redirect_uri
          : client.redirect_uri
      );

      /**
       * Authorization code grant
       *
       * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2}
       *
       */
      const code = issueCode(user.sub, client.id, redirectURL.toString());

      redirectURL.searchParams.append("code", code.id);

      if (params.state) {
        redirectURL.searchParams.append("state", params.state);
      }

      res.redirect(redirectURL);
    } catch (error) {
      console.log(error);

      session.destroy(function (error) {
        console.error(error);
      });

      next(error);
    }
  },
]);

module.exports = router;
