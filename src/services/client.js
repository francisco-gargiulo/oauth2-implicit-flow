const Client = require("../domain/client");
const Repository = require("../repository");

const clientRepository = new Repository("client");

function findClient(clientId) {
  let client;

  try {
    const entity = clientRepository.findById(clientId);

    client = new Client(entity);
  } catch (error) {
    console.error(error);
  }

  return client;
}

module.exports = {
  findClient,
};
