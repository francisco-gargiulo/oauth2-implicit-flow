module.exports = async function ({ query, session }, res, next) {
  if (!session.user) {
    const loginURL = new URL("http://localhost:3000/login");

    return res.redirect(loginURL);
  }

  next();
};
