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
router.use("/authorize", require("./controllers/authorize"));

// session
router.use("/login", require("./controllers/login"));
router.use("/logout", require("./controllers/logout"));

module.exports = router;
