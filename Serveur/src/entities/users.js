const { ObjectId } = require("mongodb");
const dbName = "base1"
const colName = "Users"

class Users {
  constructor(db) {
    this.db = db;
  }

  create(client, login, password, lastName, firstName) {
    return new Promise((resolve, reject) => {
      const newUser = {
        login,
        password,
        lastName,
        firstName,
        friends: []
      };
      client
        .db(dbName)
        .collection(colName)
        .insertOne(newUser)
        .then((result) => {resolve(result.insertedId)})
        .catch((error) => {reject(error)})
    });
  }

  //Renvoie l'utilisateur dont l'id correspond à celui en paramètre
  get(client, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .findOne({ login: { $eq: login } })
        .then((user) => {resolve(user)})
        .catch((error) => {reject(error)});
    });
  } 

  //Verifie si l'utilisateur existe dans la base de donnée et le renvoie
  async exists(client, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .findOne({ login: { $eq: login } })
        .then((user) => {
          if (user) {
            resolve(user);
          } else {
            resolve(null);
          }
        })
        .catch((error) => {reject(error)});
    });
  }

  //Verifie si le mot de passe en paramètre correspond à celui dans la base de donnée
  checkpassword(client, login, password) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .findOne({
          login: { $eq: login },
          password: { $eq: password }
        })
        .then((user) => {
          if (user) {
            resolve(user._id);
          } else {
            resolve(null);
          }
        })
        .catch((err) => {reject(err)});
    });
  }

  delete(client, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .deleteOne({ login: { $eq: login } })
        .then((user) => {
          if (user) {
            resolve(user.insertedId);
          } else {
            resolve(null);
          }
        })
        .catch((error) => {reject(error)});
    });
  }
  
  edit(client, oldlogin, login, password, lastName, firstName) {
    return new Promise((resolve, reject) => {
      const update = {}
      if(login !== undefined) {
        update["login"] = login
      }
      if(password !== undefined) {
        update["password"] = password
      }
      if(lastName !== undefined) {
        update["lastName"] = lastName
      }
      if(firstName !== undefined) {
        update["firstName"] = firstName
      }
      client
        .db(dbName)
        .collection(colName)
        .updateOne({ login: {$eq: oldlogin} }, { $set: update})
        .then(newUser => resolve(newUser))
        .catch(err => reject(err))
    });
  }

  filterLogin(client, filter) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection(colName)
        .find()
        .toArray()
        .then(users => {
          const arrayFilter = users.filter(item => item.login.toLowerCase().includes(filter.toLowerCase()));
          if(arrayFilter.length == 0) {
            resolve(null)
          } else {
            resolve(arrayFilter)
          }  
        })
        .catch(error => {reject(error)})
    })
  }
}

exports.default = Users;
