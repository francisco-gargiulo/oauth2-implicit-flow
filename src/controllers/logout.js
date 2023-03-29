var router = require("express").Router();

router.get("/", function (req, res, next) {
  req.session.user = null;

  req.session.save(function (err) {
    if (err) {
      return next(err);
    }

    req.session.regenerate(function (err) {
      if (err) {
        return next(err);
      }

      // TODO: redirect to the client's logout URL
      res.redirect("http://localhost:3000");
    });
  });
});

module.exports = router;
