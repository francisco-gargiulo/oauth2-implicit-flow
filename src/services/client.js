const Client = require("../domain/client");
const Repository = require("../repository");

const clientRepository = new Repository("client");

function issueClient(data) {
  const client = new Client(data);

  return clientRepository.create(client);
}

function findClient(id) {
  const client = clientRepository.findById(id);

  return client;
}

module.exports = {
  issueClient,
  findClient,
};
