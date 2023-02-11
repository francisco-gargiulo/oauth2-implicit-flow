const { randomUUID } = require("crypto");
const db = require("./database");

module.exports = class Repository {
  constructor(name) {
    this.table = db[name] || {};
  }

  create(entity) {
    if (!entity) {
      throw new Error("Entity required");
    }

    delete entity.id;

    const id = randomUUID();

    this.table[id] = { ...entity };

    return {
      id,
      ...entity,
    };
  }

  findById(id) {
    var row = this.table[id];

    if (!row) {
      throw new Error("Entity not found");
    }

    return {
      id,
      ...row,
    };
  }

  findOne(query) {
    for (const row in this.table) {
      const obj = this.table[row];

      let match;
      for (const iterator in query) {
        if (obj[iterator]) {
          match = obj[iterator] === query[iterator];

          if (!match) {
            break;
          }

          continue;
        }

        break;
      }

      if (!match) {
        continue;
      }

      return obj;
    }
  }

  update(id, entity) {
    var row = this.table[id];

    if (!row) {
      throw new Error("Entity not found");
    }

    this.table[id] = {
      ...row,
      ...entity,
    };

    return {
      id,
      ...entity,
    };
  }

  remove(id) {
    delete this.table[id];

    return true;
  }
};
