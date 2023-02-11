module.exports = class User {
  constructor(user) {
    this.sub = user.sub;
    this.name = user.name;
    this.given_name = user.given_name;
    this.family_name = user.family_name;
    this.preferred_username = user.preferred_username;
    this.email = user.email;
    this.picture = user.picture;
    this.password = user.password;
  }

  toJSON = () => {
    return {
      sub: this.sub,
      name: this.name,
      given_name: this.given_name,
      family_name: this.family_name,
      preferred_username: this.preferred_username,
      email: this.email,
      picture: this.picture,
      password: this.password,
    };
  };
};
