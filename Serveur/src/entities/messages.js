const { ObjectId } = require('mongodb');
const dbName = 'base1';

class Messages {
  constructor(db) {
    this.db = db;
  }

  create(client, login, date, clock, content) {
    return new Promise((resolve, reject) => {
      const newMess = {
        type: 'message',
        login,
        date,
        clock,
        content,
        alert: 0,
        warningList: [],
        likes: {
          count: 0,
          login: [],
        },
      };
      client
        .db(dbName)
        .collection('Messages')
        .insertOne(newMess)
        .then((result) => {
          resolve('Message créé avec succès');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createComment(client, parentId, login, date, clock, content) {
    return new Promise((resolve, reject) => {
      const newMess = {
        type: 'comment',
        parentId,
        login,
        date,
        clock,
        content,
        alert: 0,
        warningList: [],
        likes: {
          count: 0,
          login: [],
        },
      };
      client
        .db(dbName)
        .collection('Messages')
        .insertOne(newMess)
        .then((result) => {
          resolve('Commentaire créé avec succès');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  get(client, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .find({ login: { $eq: login } })
        .toArray()
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getComments(client, parentId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .find({ parentId: { $eq: parentId } })
        .toArray()
        .then((comment) => {
          resolve(comment);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getNbComments(client, parentId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .find({ parentId: { $eq: parentId } })
        .toArray()
        .then((comment) => {
          console.log(comment);
          resolve({ nbComments: comment.length });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAll(client, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Users')
        .findOne({ login: { $eq: login } })
        .then((user) => {
          client
            .db(dbName)
            .collection('Messages')
            .find({ alert: { $lt: 10 }, type: { $eq: 'message' } })
            .toArray()
            .then((messages) => {
              resolve(
                messages.filter(
                  (message) => !user.blackList.includes(message.login)
                )
              );
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  delete(client, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .deleteOne({ _id: { $eq: new ObjectId(messageId) } })
        .then((user) => {
          resolve('Suppression du message réussi');
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deleteAll(client, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .deleteMany({ login: { $eq: login } })
        .then((result) => {
          resolve('Suppression des messages réussi');
        })
        .catch((error) => reject(error));
    });
  }

  getLike(client, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .findOne({ _id: { $eq: new ObjectId(messageId) } })
        .then((message) => {
          resolve({ nbLikes: message.likes.count });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUserLike(client, login, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .findOne({ _id: { $eq: new ObjectId(messageId) } })
        .then((message) => {
          const user = message.likes.login.filter((user) => user == login);
          if (user.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  like(client, login, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .findOne({ _id: { $eq: new ObjectId(messageId) } })
        .then((message) => {
          const user = message.likes.login.filter((user) => user == login);
          if (user.length == 0) {
            message.likes.count++;
            message.likes.login.push(login);
            client
              .db(dbName)
              .collection('Messages')
              .updateOne(
                { _id: { $eq: new ObjectId(messageId) } },
                {
                  $set: {
                    'likes.count': message.likes.count,
                    'likes.login': message.likes.login,
                  },
                }
              )
              .then((result) => resolve('+1'))
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve('Déjà like');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  dislike(client, login, messageId) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .findOne({ _id: { $eq: new ObjectId(messageId) } })
        .then((message) => {
          const user = message.likes.login.filter((user) => user == login);
          if (user.length != 0) {
            client
              .db(dbName)
              .collection('Messages')
              .updateOne(
                { _id: { $eq: new ObjectId(messageId) } },
                { $pull: { 'likes.login': login } }
              )
              .then((result) => {
                client
                  .db(dbName)
                  .collection('Messages')
                  .updateOne(
                    { _id: { $eq: new ObjectId(messageId) } },
                    { $inc: { 'likes.count': -1 } }
                  )
                  .then((result) => {
                    resolve('-1');
                  })
                  .catch((error) => {
                    reject(error);
                  });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve('Déjà dislike');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  filterMessage(client, filter) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .find()
        .toArray()
        .then((messages) => {
          const arrayFilter = messages.filter((item) =>
            item.content.toLowerCase().includes(filter.toLowerCase())
          );
          if (arrayFilter.length == 0) {
            resolve(null);
          } else {
            resolve(arrayFilter);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  warning(client, messageId, login) {
    return new Promise((resolve, reject) => {
      client
        .db(dbName)
        .collection('Messages')
        .findOne({ _id: { $eq: new ObjectId(messageId) } })
        .then((message) => {
          const user = message.warningList.filter((user) => user == login);
          if (user.length == 0) {
            message.warningList.push(login);
            message.alert++;
            client
              .db(dbName)
              .collection('Messages')
              .updateOne(
                { _id: { $eq: new ObjectId(messageId) } },
                {
                  $set: {
                    warningList: message.warningList,
                    alert: message.alert,
                  },
                }
              )
              .then((result) => resolve('Signalement réussi'))
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve('Déjà signalé');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

exports.default = Messages;
