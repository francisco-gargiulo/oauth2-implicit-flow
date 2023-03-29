const { randomUUID } = require("crypto");
const database = require("./database");

module.exports = class Repository {
  constructor(name) {
    this.table = database[name] || {};
  }

  create(newEntity) {
    if (!newEntity) {
      throw new Error("Entity required");
    }

    delete newEntity.id;

    const id = randomUUID();

    this.table[id] = { ...newEntity };

    return {
      id,
      ...newEntity,
    };
  }

  findById(id) {
    const entity = this.table[id];

    if (!entity) {
      throw new Error("Entity not found");
    }

    return {
      id,
      ...entity,
    };
  }

  findOne(query) {
    for (const entityKey in this.table) {
      const entity = this.table[entityKey];

      let match = true;
      for (const propertyKey in query) {
        if (entity[propertyKey]) {
          match = entity[propertyKey] === query[propertyKey];

          if (!match) {
            break;
          }

          continue;
        }

        match = false;
        break;
      }

      if (match) {
        return entity;
      }
    }

    throw new Error("Entity not found");
  }

  update(id, updatedValues) {
    const entity = this.table[id];

    if (!entity) {
      throw new Error("Entity not found");
    }

    this.table[id] = {
      ...entity,
      ...updatedValues,
    };

    return {
      id,
      ...updatedValues,
    };
  }

  remove(id) {
    delete this.table[id];

    return true;
  }
};
