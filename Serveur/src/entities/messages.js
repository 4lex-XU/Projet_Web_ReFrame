const { error } = require("console");
const { ObjectId } = require("mongodb");
const { resolve } = require("path");
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
        .collection("Messages")
        .insertOne(newMess)
        .then((result) => {resolve(result.insertedId)})
        .catch((error) => {reject(error)})
    })    
  }

  get(client, login) {
    return new Promise((resolve, reject) => {
      client
      .db(dbName)
      .collection("Messages")
      .findMany({ login: {$eq:login} })
      .then(user => {resolve(user)})
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

  delete(client, userId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .deleteOne({ _id: { $eq: new ObjectId(userId) } })
        .then((user) => {resolve("Suppression du message réussi")})
        .catch((error) => {reject(error)});
    });
  } 

  deleteAll(client, login){
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .deleteMany({login: {$eq: login}})
        .then(result => {resolve("Suppression des messages réussi")})
        .catch(error => reject(error))
    })
  }

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