const { ObjectId } = require("mongodb");
const dbName = "base1"
const colName = "Users"

class Messages {
  constructor(db) {
    this.db = db;
  }

  create(client, login, date, texte) {
    return new Promise((resolve, reject) => {
        const newMess = {
            login,
            date,
            texte,
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
              .then(result => {resolve("Nouveau message publié");})
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

  like(client, login, mess_login, pos, newlike_login) {
    return new Promise((resolve, reject) => {
      client
        .db("base1")
        .collection("Users")
        .updateOne(
          { login: {$eq: login}, messages: {login: {$eq: mess_login}} },
          { $push: {'messages.$.like.like_login': newlike_login } } 
        )
        .then(result => {resolve("+1")})
        .catch(error => {reject(error)})
    })
  };

}

exports.default = Messages;