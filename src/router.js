const router = require("express").Router();

// index
router.get("/", function (req, res) {
  res.json({
    ...req.session,
  });
});

/** Protocol endpoints
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3 | Protocol endpoints}
 */
router.use("/authorize", require("./controllers/authorization"));
router.use("/token", require("./controllers/token"));

// session
router.use("/login", require("./controllers/login"));
router.use("/logout", require("./controllers/logout"));

// protected resource
router.use("/userinfo", require("./controllers/userinfo"));

module.exports = router;
