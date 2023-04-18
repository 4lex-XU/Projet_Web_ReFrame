const express = require("express");
const { MongoClient } = require("mongodb");

//Connexion à la base de donnée
const uri = "mongodb+srv://Alex_XU:BaqCwVYwygmFprda@reframe.wopabvm.mongodb.net/test";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");
const Friends = require("./entities/friends.js");
const e = require("express");

function init(db) {
  const router = express.Router();
  // On utilise JSON
  router.use(express.json());
  // simple logger for this router's requests
  // all requests to this router will first hit this middleware
  router.use((req, res, next) => {
    console.log("API: method %s, path %s", req.method, req.path);
    console.log("Body", req.body);
    next();
  });

  const users = new Users.default(db);
  const messages = new Messages.default(db);
  const friends = new Friends.default(db);

  // USERS

  // LOGIN
  router.post("/user/login", async (req, res) => {
    try {
      const { login, password } = req.body;

      // Erreur: absence d'arguments
      if (!login || !password) {
        res.status(400).json({
          status: 400,
          message: "Requête invalide : login et password nécessaires"
        });
        return;
      }

      // Erreur: utilisateur inexistent
      if (!(await users.exists(client, login))) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur inconnu"
        });
        return;
      }

      // Vérification du mot de passe
      let userid = await users.checkpassword(client, login, password);
      if (userid) {
        // Création d'une session
        req.session.regenerate(function (err) {
          if (err) {
            res.status(500).json({
              status: 500,
              message: "Erreur interne",
              details: (err || "Erreur inconnue").toString()
            });
          } else {
             // C'est bon, session créée
            req.session.userid = userid;
            req.session.login = login;
            res.status(200).json({
              status: 200,
              message: "Connexion réussie"
            });
          }
        });
        return;
      }
      // Faux login : destruction de la session et erreur
      req.session.destroy((err) => {});
      res.status(403).json({
        status: 403,
        message: "Login et/ou le mot de passe invalide(s)"
      });
      return;
    } catch (e) {
      // Toute autre erreur
      res.status(500).json({
        status: 500,
        message: "Erreur interne",
        details: (e || "Erreur inconnue").toString()
      });
    }
  });

  // LOGOUT
  router.post("/user/logout", async (req, res) => {
    try {
      if(!req.session.userid) {
        res.status(401).json({ 
          status: 401, 
          message: "Non connecté" 
        });
        return;
      }
      // Destruction de la session
      req.session.destroy((e) => {
        if (e) {
          res.status(500).json({
            status: 500,
            message: "Erreur interne",
            details: (e || "Erreur inconnue").toString()
          });
        } else {
          // C'est bon, session détruite  
          res.status(200).json({
            status: 200,
            message: "Déconnexion réussie"
          });
        }
      });
    } catch (e) {
      // Toute autre erreur
      res.status(500).json({
        status: 500,
        message: "Erreur interne",
        details: (e || "Erreur inconnue").toString()
      });
    }
  });

  router
    .route("/user/:user_id")
  // GET USER -> retourne un seul utilisateur dont l'id est passé dans l'url
    .get(async (req, res) => {
      try {
        const user = await users.get(client, req.params.user_id);
        if (!user) {
          res.status(404).json({
            status: 404,
            message: "Utilisateur non trouvé"
          })
        } else {
          res.status(200).send(user);
        }
      } catch (e) {
        res.status(500).json({
          status: 500,
          message: "Erreur interne",
          details: (e || "Erreur inconnue").toString()
        });
      }
    })

  // DELETE USER -> supprime un seul utilisateur dont l'id est passé dans l'url
    .delete((req, res, next) => {
      if(req.session.userid != req.params.user_id) {
        res.status(401).json({ 
          status: 401, 
          message: "Non connecté" 
        });
        return;
      }
      users
        .delete(client, req.params.user_id)
        .then((result) => {res.status(200).send(`Supression de l'utilisateur ${req.params.user_id} réussie`)})
        .catch((e) => {
          res.status(500).json({ 
            status: 500, 
            message: "Erreur interne", 
            details: (e || "Erreur inconnue").toString()
          })
        })
    });

  // CREATE USER
  router.put("/user", async (req, res) => {
    const { login, password, lastname, firstname } = req.body;
    if (!login || !password || !lastname || !firstname) {
      res.status(400).json({
        status: 400,
        message: "Champs manquants"
      });
      return;
    }
    if (await users.exists(client, login)) {
      res.status(403).json({
        status: 403,
        message: "Utilisateur existant",
        detail: `${login} existe déjà`
      });
      return;
    }
    users
      .create(client, login, password, lastname, firstname)
      .then((user_id) => res.status(201).send({ id: user_id }))
      .catch((e) =>
        res.status(500).json({
          status: 500,
          message: "Erreur interne",
          details: (e || "Erreur inconnue").toString()
        })
      );
  });

  // EDIT USER
  router.post("/user/:login/edit", async (req, res) => {
    if(!req.session.userid) {
      res.status(401).json({ 
        status: 401, 
        message: "Non connecté" 
      });
      return;
    }
    const { login, password, confirmpassword, lastname, firstname } = req.body;
    if (!login || !password || !confirmpassword || !lastname || !firstname) {
      res.status(400).json({
        status: 400,
        message: "Champs manquants"
      });
      return;
    }
    if (await users.exists(client, login)) {
      res.status(403).json({
        status: 403,
        message: "Utilisateur existant",
        detail: `${login} existe déjà`
      });
      return;
    }
    users
      .edit(client, req.params.login, login, password, lastname, firstname)
      .then(() => {
        req.session.login = login;
        res.status(200).send("Modification enregistré");})
      .catch((e) => 
        res.status(500).json({ 
          status: 500, 
          message: "Erreur interne",
          details: (e || "Erreur inconnue").toString() 
      }));
  });

  //MESSAGES

  // CREATE MESSAGE
  router.put("/user/:login/newMessage", async(req, res) => {
    if(!req.session.userid) {
      res.status(401).json({ 
        status: 401, 
        message: "Non connecté" 
      });
      return;
    }
    const { login, date, texte } = req.body;
    if (!login || !date || !texte) {
      res.status(400).json({
        status: 400,
        message: "Champs manquants"
      });
      return;
    }
    if (!(await users.exists(client, req.params.login))) {
      res.status(404).json({
        status: 404,
        message: "Utilisateur n'existe pas"
      });
      return;
    }
    messages
      .create(client, login, date, texte)
      .then((result) => res.status(201).send(result))
      .catch((e) =>
        res.status(500).json({
          status: 500,
          message: "Erreur interne",
          details: (e || "Erreur inconnue").toString()
        })
      );
  });

  // GET MESSAGES -> retourne la liste de message d'un utilisateur
  router
    .get("/user/:login/messages", async (req, res) => {
    try {
      if(!req.session.userid) {
        res.status(401).json({ 
          status: 401, 
          message: "Non connecté" 
        });
        return;
      }
      if (!(await users.exists(client, req.params.login))) {
        res.status(404).json({
          status: 404,
          message: "Utilisateur n'existe pas"
        });
        return;
      }
      const mess = await messages.get(client, req.params.login);
      if(mess.length == 0) {
        res.status(202).send("Aucun message trouvé")
      } else {
        res.status(200).send(mess)
      }
    } catch (e) {
        res.status(500).json({ 
          status: 500, 
          message: "Erreur interne", 
          details: (e || "Erreur inconnue").toString()
        })
      }
  });

  // DELETE MESSAGE 
  router.delete("/user/:login/messages/:indice", async(req, res, next) => {
    if(!req.session.userid) {
      res.status(401).json({ 
        status: 401, 
        message: "Non connecté" 
      });
      return;
    }
    if (!(await users.exists(client, req.params.login))) {
      res.status(404).json({
        status: 404,
        message: "Utilisateur n'existe pas"
      });
      return;
    }
    messages
      .delete(client, req.params.login, req.params.indice)
      .then((result) => {res.status(201).send(result)})
      .catch((e) =>{
        if(e === "Message non trouvé"){
          res.status(404).json({  
            status: 404, 
            message: e
          })
        } else {
          res.status(500).json({
            status: 500, 
            message: "Erreur interne", 
            details: (e || "Erreur inconnue").toString()
          })
        }
      })
  });

  //LIKER MESSAGE
  router.post("/user/:login/messages/:mess_login/:indice/:like_login", async(req, res) => {
    if(!req.session.userid) {
      res.status(401).json({ status: 401, message: "Non connecté" });
      return;
    }
    if (!(await users.exists(client, req.params.like_login))) {
      res.status(404).json({
        status: 404,
        message: "Utilisateur n'existe pas"
      });
      return;
    }
    messages
      .like(client, req.params.login, req.params.mess_login, req.params.indice, req.params.like_login)
      .then(result => {res.status(200).send(result)})
      .catch(error => {
        res.status(500).json({
          status: 500,
          message: "Erreur interne"
        })
      })
  });

  //FRIENDS

  //CREATE FRIEND
  router.put("/user/:login/newfriend", async(req, res) => {
    if(!req.session.userid) {
      res.status(401).json({ 
        status: 401, 
        message: "Non connecté" 
      });
      return;
    }
    const { friend_login } = req.body;
    if (!friend_login) {
      res.status(400).json({
        status: 400,
        message: "Champs manquants"
      });
      return;
    }
    if (!(await users.exists(client, req.params.login))) {
      res.status(404).json({
        status: 404,
        message: "Utilisateur n'existe pas"
      });
      return;
    }
    if (!(await users.exists(client, friend_login))) {
      res.status(404).json({
        status: 404,
        message: "Ami n'existe pas"
      });
      return;
    }
    if (await friends.getFriend(client, req.params.login, friend_login)) {
      res.status(401).json({
        status: 401,
        message: "Déjà ami"
      });
      return;
    }
    friends
      .create(client, req.params.login, friend_login)
      .then((result) => res.status(201).send(result))
      .catch((e) =>
        res.status(500).json({
          status: 500,
          message: "Erreur interne",
          details: (e || "Erreur inconnue").toString()
        })
      )
  });

  //GET FRIENDS -> retourne la liste d'ami d'un utilisateur
  router.get("/user/:login/friends", async(req, res) => {
    try {
      if(!req.session.userid) {
        res.status(401).json({ 
          status: 401, 
          message: "Non connecté" 
        });
        return;
      }
      if (!(await users.exists(client, req.params.login))) {
        res.status(404).json({
          status: 404,
          message: "Utilisateur n'existe pas"
        });
        return;
      }
      const arrayFriends = await friends.get(client, req.params.login);
      if(arrayFriends.length == 0) {
        res.status(202).send("Aucun ami trouvé")
      }
      else res.status(200).json(arrayFriends)
    } catch (e) {
        res.status(500).json({ 
          status: 500, 
          message: "Erreur interne", 
          details: (e || "Erreur inconnue").toString()
        })
    }
  });

  router
    .route("/user/:login/:friend_login")
  //DELETE FRIEND
    .delete(async(req, res, next) => {
    if(!req.session.userid) {
      res.status(401).json({ 
        status: 401, 
        message: "Non connecté" 
      });
      return;
    }
    if (!(await friends.getFriend(client, req.params.login, req.params.friend_login))) {
      res.status(404).json({
        status: 404,
        message: "Ami non trouvé"
      });
      return;
    }
    friends
      .delete(client, req.params.login, req.params.friend_login)
      .then((result) => {res.status(201).send(result)})
      .catch((e) => {
        res.status(500).json({ 
          status: 500, 
          message: "Erreur interne",
          details: (e || "Erreur inconnue").toString()
        })
      })
  });
  
  return router;
}

exports.default = init;