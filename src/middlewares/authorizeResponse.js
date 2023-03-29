const AuthorizeError = require("../errors/authorizeError");

const { issueToken } = require("../services/token");

/**
 * Implicit Grant Response
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.2}
 *
 */
module.exports = function (
  { session: { params, user, client, ...session } },
  res,
  next
) {
  try {
    if (params.response_type !== "token") {
      throw new AuthorizeError(
        "unsupported_response_type",
        "response_type must be token"
      );
    }

    /**
     * Redirect URL
     *
     * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.1.2}
     *
     */
    const redirectURL = new URL(params.redirect_uri || client.redirect_uri);

    const { access_token, token_type, expires_in } = issueToken(
      user.sub,
      user.email,
      user.nickname
    );

    const searchParams = new URLSearchParams({
      access_token,
      token_type,
      expires_in,
    });

    if (params.state) {
      searchParams.append("state", params.state);
    }

    // Using the fragment identifier to return access tokens is recommended
    // over using the query component, because the query component is included
    // in the HTTP request, which could potentially be logged or cached by the
    // server.
    redirectURL.hash = searchParams.toString();

    res.redirect(redirectURL);
  } catch (error) {
    console.log(error);

    session.destroy(function (error) {
      console.error(error);
    });

    next(error);
  }
};
