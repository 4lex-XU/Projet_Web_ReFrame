const { ObjectId, Db, Collection } = require("mongodb");
const dbName = "base1"
const colName = "Users"

class BlackList {
  constructor(db) {
    this.db = db;
  }

  create(client, login, blackLogin){
    return new Promise((resolve, reject) => {
        client
          .db(dbName)
          .collection(colName)
          .updateOne({ login: {$eq: login} }, { $push: {blackList: blackLogin} })
          .then(result => {resolve("Bloqué")})
          .catch(error => {reject(error)})
    })
  }

  //GET BLACKLIST -> retourne la liste noire de l'utilisateur
  get(client, login) {
    return new Promise((resolve, reject) => {
        client
          .db(dbName)
          .collection(colName)
          .findOne({ login: {$eq:login} })
          .then(user => {resolve(user.blackList)})
          .catch(error => {reject(error)});
      })
    }

  //Verifie si l'ami est présent dans la liste de l'utilisateur
  isBlack(client, login, blackLogin){
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .findOne({ login: {$eq: login} })
        .then(user => {
          const arrayBlack = user.blackList.filter(item => item.toLowerCase() === (blackLogin.toLowerCase()));
          if(arrayBlack.length == 0) {
            resolve(null)
          } else {
            resolve(arrayBlack)
          }  
        })
        .catch(error => {reject(error)})
    })
  }

  delete(client, login, blackLogin) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .updateOne({ login: {$eq: login} }, { $pull: {blackList: {$eq: blackLogin}} })
        .then(result => {resolve("Débloqué")})
        .catch(error => {reject(error)})
    })
  }

}

exports.default = BlackList;