const { ObjectId } = require("mongodb");
const dbName = "base1"

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
          alert: 0,
          likes: {
            count: 0,
            login: []
          }
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
      .find({ login: {$eq:login} })
      .toArray()
      .then(user => {resolve(user)})
      .catch(error => {reject(error)});
    })
  }

  getAll(client, login) {
    return new Promise((resolve, reject) => {
      client
      .db(dbName)
      .collection("Users")
      .findOne({ login: { $eq: login } })
      .then(user => {
        client
          .db(dbName)
          .collection("Messages")
          .find({alert: {$lt: 10}})
          .toArray()
          .then(messages => {
            resolve(messages.filter(message => !user.blackList.includes(message.login)))
          })
          .catch(error => {reject(error)})
      })
      .catch(error => {reject(error)})
    })
  }

  delete(client, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .deleteOne({ _id: { $eq: new ObjectId(messageId) } })
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

  like(client, login, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .updateOne(
          { _id: { $eq: new ObjectId(messageId) } },
          { $push: { "likes.login": login } },
        )
        .then(result => {
          client
            .db(dbName)
            .collection("Messages")
            .updateOne(
              { _id: { $eq: new ObjectId(messageId) } },
              { $inc: { "likes.count": 1 }}
            )
            .then(result => {resolve("+1")})
            .catch(error => {reject(error)})
          })
        .catch(error => {reject(error)})
    })
  };

  dislike(client, login, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .updateOne(
          { _id: { $eq: new ObjectId(messageId) } },
          { $pull: { "likes.login": login } },
        )
        .then(result => {
          client
            .db(dbName)
            .collection("Messages")
            .updateOne(
              { _id: { $eq: new ObjectId(messageId) } },
              { $inc: { "likes.count": -1 }}
            )
            .then(result => {resolve("-1")})
            .catch(error => {reject(error)})
          })
        .catch(error => {reject(error)})
    })
  };

  filterMessage(client, filter) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .find()
        .toArray()
        .then(messages => {
          const arrayFilter = messages.filter(item => item.content.toLowerCase().includes(filter.toLowerCase()));
          if(arrayFilter.length == 0) {
            resolve(null)
          } else {
            resolve(arrayFilter)
          }  
        })
        .catch(error => {reject(error)})
    })
  }

  warning(client, messageId){
    return new Promise((resolve,reject) => {
      client
        .db(dbName)
        .collection("Messages")
        .updateOne({ _id: { $eq: new ObjectId(messageId) } }, {$inc: {alert: 1}})
        .then((user) => {resolve("Signalement réussi")})
        .catch((error) => {reject(error)});
    })
  }
}

exports.default = Messages;