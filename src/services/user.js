const User = require("../domain/user");
const Repository = require("../repository");

const userRepository = new Repository("user");

function issueUser(data) {
  const user = new User(data);

  return userRepository.create(user.toJSON());
}

function findUserByEmail(email) {
  const user = userRepository.findOne({
    email,
  });

  return user;
}

function findUserBySub(sub) {
  const user = userRepository.findOne({
    sub,
  });

  return user;
}

module.exports = {
  issueUser,
  findUserByEmail,
  findUserBySub,
};
