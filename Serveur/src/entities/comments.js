const { ObjectId } = require("mongodb");
const dbName = "base1"

class Commentaires {
  constructor(db) {
    this.db = db;
  }

  create(client, messageId, date, clock, content) {
    return new Promise((resolve, reject) => {
      const newComment = {
          messageId,
          date,
          clock,
          content, 
      };
      client
        .db(dbName)
        .collection("Comments")
        .insertOne(newComment)
        .then((result) => {resolve(result.insertedId)})
        .catch((error) => {reject(error)})
    })    
  }

  delete(client, commentId) {
    return new Promise((resolve, reject) => {
        client
          .db(dbName)
          .collection("Comments")
          .deleteOne({ _id: { $eq: new ObjectId(commentId) } })
          .then(result => resolve("Commentaire supprimé"))
          .catch(error => {reject(error)})
        })
    }

    printComments(client, messageId) {
        return new Promise((resolve, reject) => {
            client
              .db(dbName)
              .collection("Comments")
              .find({ messageId: {$eq:messageId} })
              .toArray()
              .then(comment => {resolve(comment)})
              .catch(error => {reject(error)});
          })
    }

}

exports.default = Commentaires;