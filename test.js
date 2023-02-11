const axios = require("axios");

/**
 * Boot server
 */
require("./src");

// Populate with initial data
const { issueUser } = require("./src/services/user");
const { issueClient } = require("./src/services/client");

const user = issueUser({
  sub: "248289761001",
  name: "Jane Doe",
  given_name: "Jane",
  family_name: "Doe",
  preferred_username: "j.doe",
  picture: "http://example.com/janedoe/me.jpg",
  email: "user@email.com",
  password: "p4ssw0rd",
});

/**
 * Client Registration
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-2}
 */
const client = issueClient({
  type: "confidential",
  secret: "client-secret",
  // this must be call to client callback
  redirect_uri: "http://localhost:3000/",
});

/**
 * Authorization Code Grant
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-4.1}
 *
 */
(async function () {
  try {
    const baseURL = "http://localhost:3000/";

    const params = {
      client_id: client.id,
      response_type: "code",
      state: "xyz", // recommended
    };

    let response;

    // Boot session
    response = await axios({
      method: "get",
      url: "/",
      baseURL,
    });

    /**
     * Step A
     *
     * The client initiates the flow by directing the resource owner's
     * user-agent to the authorization endpoint.  The client includes
     * its client identifier, requested scope, local state, and a
     * redirection URI to which the authorization server will send the
     * user-agent back once access is granted (or denied).
     */
    response = await axios({
      method: "get",
      url: "/authorize",
      baseURL,
      params,
      headers: {
        Cookie: response.headers["set-cookie"],
      },
    });

    /**
     * Step B
     *
     * The authorization server authenticates the resource owner (via
     * the user-agent) and establishes whether the resource owner
     * grants or denies the client's access request.
     */
    response = await axios({
      method: "post",
      url: "/login",
      baseURL,
      headers: {
        Cookie: response.request.getHeader("Cookie"),
      },
      auth: {
        username: user.email,
        password: user.password,
      },
    });

    /**
     * Step C
     *
     * Assuming the resource owner grants access, the authorization
     * server redirects the user-agent back to the client using the
     * redirection URI provided earlier (in the request or during
     * client registration).  The redirection URI includes an
     * authorization code and any local state provided by the client
     * earlier.
     */

    const code = new URL(response.request.path, baseURL).searchParams.get(
      "code"
    );

    /**
     * Step D
     *
     * The client requests an access token from the authorization
     * server's token endpoint by including the authorization code
     * received in the previous step.  When making the request, the
     * client authenticates with the authorization server.  The client
     * includes the redirection URI used to obtain the authorization
     * code for verification.
     */
    response = await axios({
      method: "post",
      url: "/token",
      baseURL,
      auth: {
        username: client.id,
        password: client.secret,
      },
      data: {
        client_id: client.id,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/",
        code,
      },
    });

    /**
     * Step E
     *
     * The authorization server authenticates the client, validates the
     * authorization code, and ensures that the redirection URI
     * received matches the URI used to redirect the client in
     * step (C).  If valid, the authorization server responds back with
     * an access token and, optionally, a refresh token.
     */

    const tokenGrant = response.data;

    /**
     * Protected resource
     *
     * {@link https://www.rfc-editor.org/rfc/rfc6749#section-7}
     */
    response = await axios({
      method: "get",
      url: "/userinfo",
      baseURL,
      headers: {
        Authorization: `Bearer ${tokenGrant.access_token}`,
      },
    });

    console.log("GET /userinfo ->", response.data);

    // TODO: Request new Access Token with Refresh Token
  } catch (error) {
    console.log(error.message);
  }
})();
