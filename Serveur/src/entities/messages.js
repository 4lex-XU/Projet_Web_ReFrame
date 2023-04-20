const { ObjectId } = require("mongodb");
const dbName = "base1"
const colName = "Users"

class Messages {
  constructor(db) {
    this.db = db;
  }

  create(client, login, date, clock, content) {
    return new Promise((resolve, reject) => {
        const newMess = {
            login,
            date,
            clock,
            content, 
            likes: {
              count: 0,
              login: []
            },
            comment: []
        };
        client
          .db(dbName)
          .collection(colName)
          .findOne({ login: {$eq: login} })
          .then(user => {
            user.messages.push(newMess);
            client
              .db(dbName)
              .collection(colName)
              .updateOne({login: {$eq: login}}, { $set: { messages: user.messages } })
              .then(result => {
                client
                  .db(dbName)
                  .collection('Messages')
                  .insertOne(newMess)
                  .then(result => {resolve("Nouveau message publié")})
                  .catch(error => {reject(error);});
              })
              .catch(error => {reject(error);});
          })
          .catch(error => {reject(error);});
    });
  }

  get(client, login) {
    return new Promise((resolve, reject) => {
      client
      .db(dbName)
      .collection(colName)
      .findOne({ login: {$eq:login} })
      .then(user => {resolve(user.messages)})
      .catch(error => {reject(error)});
    })
  }

  getAll(client) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .find()
        .toArray()
        .then(messages => {resolve(messages)})
        .catch(error => {reject(error)});
    })
  }

  delete(client, login, indice) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .findOne({ login: {$eq:login} })
        .then(user => {
          if(user.messages.length < parseInt(indice)+1) {reject("Message non trouvé")}
          user.messages.splice(indice, 1)
          client
            .db(dbName)
            .collection(colName)
            .updateOne({login: {$eq: login}}, { $set: { messages: user.messages } })
            .then(result => {resolve("Message supprimé")})
            .catch(error => {reject(error)})
        })
        .catch(error => {reject(error)})
    });
  };

  like(client, login, login_mess) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .updateOne(
          { "messages.login": {$eq: login_mess} },
          { $push: { "messages.$.likes.login": login } },
        )
        .then(result => {
          client
            .db(dbName)
            .collection(colName)
            .updateOne(
              { login: {$eq: login}, "messages.login": {$eq: login_mess} },
              { $inc: { "messages.$.likes.count": 1 }}
            )
            .then(result => {resolve("+1")})
            .catch(error => {reject(error)})
          })
        .catch(error => {reject(error)})
    })
  };

}

exports.default = Messages;