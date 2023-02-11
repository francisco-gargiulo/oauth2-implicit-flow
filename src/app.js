const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");

const RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");

const app = express();

app.use(
  session({
    store: new RedisStore({ client: new Redis() }),
    secret: "s3cr3t.",
    name: "sid",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", require("./router"));

// error handler
app.use(function (
  { status, code, description, redirect_uri, state },
  _,
  res,
  next
) {
  if (!code) {
    return res.status(500).json({
      code: "server_error",
      description: "Internal Server Error",
    });
  }

  const urlRedirect = new URL(redirect_uri);

  urlRedirect.searchParams.set("error", code);

  if (description) {
    urlRedirect.searchParams.set("error_description", description);
  }

  if (state) {
    urlRedirect.searchParams.set("state", state);
  }

  res.redirect(urlRedirect);
});

module.exports = app;
