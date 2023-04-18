const { ObjectId, Db, Collection } = require("mongodb");
const dbName = "base1"
const colName = "Users"

class Friends {
  constructor(db) {
    this.db = db;
  }

  create(client, login, friend_login){
    return new Promise((resolve, reject) => {
        const newFriend = {
            friend_login
        }
        client
          .db(dbName)
          .collection(colName)
          .updateOne({ login: {$eq: login} }, { $push: {friends: newFriend} })
          .then(result => resolve("Nouvel ami ajouté"))
          .catch(err => {reject(err)})
    })
  }

  //GET FRIENDS -> retourne la liste d'ami d'un utilisateur
  get(client, login) {
    return new Promise((resolve, reject) => {
        client
          .db(dbName)
          .collection(colName)
          .findOne({ login: {$eq:login} })
          .then(user => {resolve(user.friends)})
          .catch(error => {reject(error)});
      })
    }

  //Verifie si l'ami est présent dans la liste de l'utilisateur
  getFriend(client, login, friend_login){
      return new Promise((resolve, reject) => {
        client
          .db(dbName)
          .collection(colName)
          .findOne({ login: {$eq: login} })
          .then(user => {
            const userfriend = user.friends.filter(item => item.friend_login.toLowerCase().includes(friend_login.toLowerCase()));
            if(userfriend.length == 0) {
              resolve(null)
            } else {
              resolve(userfriend)
            }  
          })
          .catch(err => {reject(err)})
      })
  }

  delete(client, login, friend_login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .updateOne({ login: {$eq: login} }, { $pull: {friends: {friend_login: {$eq: friend_login}}} })
        .then(result => {resolve("Ami supprimé")})
        .catch(error => {reject(error)})
    })
  }
  
}

exports.default = Friends;