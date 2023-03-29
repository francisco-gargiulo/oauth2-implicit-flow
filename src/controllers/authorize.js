const router = require("express").Router();

const authorizeRequest = require("../middlewares/authorizeRequest");
const authorizeResponse = require("../middlewares/authorizeResponse");
const authenticate = require("../middlewares/authenticate");

/**
 * Authorization endpoint
 *
 * {@link https://www.rfc-editor.org/rfc/rfc6749#section-3.1}
 *
 */
router.get("/", [authorizeRequest, authenticate, authorizeResponse]);

module.exports = router;
