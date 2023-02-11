const router = require("express").Router();
const authenticate = require("../middlewares/authenticate");
const { findTokenByAccessToken } = require("../services/token");
const { findUserBySub } = require("../services/user");

router.get("/", [
  authenticate,
  function ({ session: { user } }, res) {
    res.json(user);
  },
]);

module.exports = router;
