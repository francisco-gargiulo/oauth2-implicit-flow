const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");

// Create an Express app
const app = express();

// Configure session middleware
app.use(
  session({
    store: new RedisStore({ client: new Redis() }), // Use Redis to store session data
    secret: "s3cr3t.", // A secret key used to sign the session ID cookie
    name: "sid", // Name of the session ID cookie
    resave: false, // Do not save the session if it was not modified
    saveUninitialized: true, // Save uninitialized sessions (i.e., new and not modified)
  })
);

// Configure the app's views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Add middleware to log requests in the console
app.use(logger("dev"));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));

// Parse cookies sent with the request
app.use(cookieParser());

// Route all requests to the router module
app.use("/", require("./router"));

// Define an error handling middleware function that redirects to a specified URL with an error message
app.use(function (
  { status, code, description, redirect_uri, state },
  _,
  res,
  next
) {
  if (!code) {
    // If no error code is provided, respond with a generic server error
    return res.status(500).json({
      code: "server_error",
      description: "Internal Server Error",
    });
  }

  const urlRedirect = new URL(redirect_uri); // Create a new URL object for the redirect URL

  urlRedirect.searchParams.set("error", code); // Set the "error" query parameter to the error code

  if (description) {
    // If an error description is provided, set the "error_description" query parameter
    urlRedirect.searchParams.set("error_description", description);
  }

  if (state) {
    // If a state parameter is provided, set the "state" query parameter
    urlRedirect.searchParams.set("state", state);
  }

  // Redirect to the URL with the error information in the query string
  res.redirect(urlRedirect);
});

// Export the Express app object for use in other modules
module.exports = app;
