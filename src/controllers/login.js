const router = require("express").Router();

const authenticate = require("../middlewares/authenticate");

/**
 * HTTP Authentication
 *
 * {@link https://www.rfc-editor.org/rfc/rfc9110#section-11 | HTTP Semantics: HTTP Authentication}
 * {@link https://www.rfc-editor.org/rfc/rfc7617.html | The 'Basic' HTTP Authentication Scheme}
 *
 */

router.get("/", function (req, res) {
  res.render("login");
});

router.post("/", [
  authenticate,
  function ({ session: { params } }, res) {
    const redirectURL = new URL("http://localhost:3000/authorize");

    redirectURL.search = new URLSearchParams(params);

    res.redirect(redirectURL);
  },
]);

module.exports = router;
