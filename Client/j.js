const express = require("express");
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://Alex_XU:BaqCwVYwygmFprda@reframe.wopabvm.mongodb.net/test";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");

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

  // LOGIN
  router.post("/user/login", async (req, res) => {
    try {
      const { login, password } = req.body;
      // Erreur sur la requête HTTP
      if (!login || !password) {
        res.status(400).json({
          status: 400,
          message: "Requête invalide : login et password nécessaires"
        });
        return;
      }
      if (!(await users.exists(client, login))) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur inconnu"
        });
        return;
      }
      let userid = await users.checkpassword(client, login, password);
      if (userid) {
        // Avec middleware express-session
        req.session.regenerate(function (err) {
          if (err) {
            res.status(500).json({
              status: 500,
              message: "Erreur interne"
            });
          } else {
            // C'est bon, nouvelle session créée
            req.session.userid = userid;
            res.status(200).json({
              status: 200,
              message: "Login et mot de passe accepté"
            });
          }
        });
        return;
      }
      // Faux login : destruction de la session et erreur
      req.session.destroy((err) => {});
      res.status(403).json({
        status: 403,
        message: "login et/ou le mot de passe invalide(s)"
      });
      return;
    } catch (e) {
      // Toute autre erreur
      res.status(500).json({
        status: 500,
        message: "erreur interne",
        details: (e || "Erreur inconnue").toString()
      });
    }
  });

  router
    .route("/user/:user_id")
    .get(async (req, res) => {
      try {
        const user = await users.get(client, req.params.user_id);
        if (!user) res.sendStatus(404);
        else res.send(user);
      } catch (e) {
        res.status(500).send(e);
      }
    })
    .delete((req, res, next) => {
      users.delete(client, req.params.user_id);
      res.send(`delete user ${req.params.user_id}`);
    });

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
      res.status(401).json({
        status: 401,
        message: "Utilisateur existant",
        detail: `${login} existe déjà`
      });
      return;
    }
    users
      .create(client, login, password, lastname, firstname)
      .then((user_id) => res.status(201).send({ id: user_id }))
      .catch((err) =>
        res.status(500).json({
          status: 500,
          message: err
        })
      );
  });

  //PARTIE MESSAGES

  router.put("/user/:login/newMessage", (req, res) => {
    const { login, date, texte } = req.body;
    if (!login || !date || !texte) {
      res.status(400).json({
        status: 400,
        message: "Champs manquants"
      });
    }
    messages
      .create(client, login, date, texte)
      .then((result) => res.status(201).send({ result }))
      .catch((err) =>
        res.status(500).json({
          status: 500,
          message: err
        })
      );
  });
  router.get("/user/:login/messages", async (req, res) => {
    try {
      const mess = await messages.get(client, req.params.login);
      if (!mess) res.sendStatus(404);
      else res.send(mess);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  return router;
}
exports.default = init;
