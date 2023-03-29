const AuthorizeError = require("../errors/authorizeError");
const { findClient } = require("../services/client");

/**
 * Authorization request
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1}
 *
 */
module.exports = function (
  { query: { response_type, client_id, state, redirect_uri }, session },
  res,
  next
) {
  try {
    if (!response_type) {
      throw new AuthorizeError("invalid_request", "response_type is required");
    }

    // response_type must be a string included in the list of supported response types
    if (!["token"].includes(response_type)) {
      throw new Error("Invalid response_type");
    }

    if (!client_id) {
      throw new AuthorizeError("invalid_request", "client_id is required");
    }

    // client id must be a string with characters in the range a-z, A-Z, 0-9,
    // "-", and "_" with a maximum length of 256 characters
    if (!/^[a-zA-Z0-9-_]{1,256}$/.test(client_id)) {
      throw new Error("Invalid client_id");
    }

    const client = findClient(client_id);

    // client_id must be registered with the authorization server
    if (!client) {
      throw new AuthorizeError("unauthorized_client", "invalid client_id");
    }

    session.client = client;

    /**
     * Dynamic redirect_uri configuration
     *
     * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.1.2.3}
     *
     */
    if (Array.isArray(client.redirect_uri) && !redirect_uri) {
      throw new AuthorizeError("invalid_request", "redirect_uri is required");
    }

    if (redirect_uri) {
      // redirect_uri must be an absolute URI
      if (
        !/^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(
          redirect_uri
        )
      ) {
        throw new AuthorizeError("unauthorized_client", "invalid redirect_uri");
      }

      // redirect_uri must be included in the list of registered redirect_uris
      const validRedirectUri = Array.isArray(client.redirect_uri)
        ? client.redirect_uri.includes(redirect_uri)
        : client.redirect_uri === redirect_uri;

      if (!validRedirectUri) {
        throw new AuthorizeError("unauthorized_client", "invalid redirect_uri");
      }
    }

    if (state) {
      // state must be a string with a maximum length of 255 characters
      if (state.length > 255) {
        throw new AuthorizeError(
          "invalid_request",
          "state parameter is invalid"
        );
      }

      // state must be a visible ASCII string
      if (!/^[ -~]+$/.test(state)) {
        throw new AuthorizeError(
          "invalid_request",
          "state parameter is invalid"
        );
      }
    }

    /**
     * Parameters sent without a value MUST be treated as if they were
     * omitted from the request. The authorization server MUST ignore
     * unrecognized request parameters. Request and response parameters
     * MUST NOT be included more than once.
     */
    session.params = {
      response_type,
      client_id,
    };

    if (state) {
      session.params.state = state;
    }

    if (redirect_uri) {
      session.params.redirect_uri = redirect_uri;
    }

    next();
  } catch (error) {
    next(error);
  }
};
