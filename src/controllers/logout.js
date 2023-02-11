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

      res.redirect("http://localhost:8080");
    });
  });
});

module.exports = router;
