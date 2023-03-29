module.exports = async function ({ session }, res, next) {
  if (!session.user) {
    const loginURL = new URL("http://localhost:3001/login");

    loginURL.search = new URLSearchParams({ ...session.params });

    return res.redirect(loginURL);
  }

  next();
};
