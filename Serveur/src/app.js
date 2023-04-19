const path = require('path');
const api = require('./api.js');
const cors = require('cors');
const corsOptions = {
    origin: true,
    credentials: true,
}

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express()
const session = require("express-session");

app.use(cors(corsOptions));
  
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "http://localhost:3000");
res.header("Access-Control-Allow-Credentials", "true");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

app.use(session({
    secret: "technoweb rocks"
}));

app.use('/api', api.default());

// Démarre le serveur
app.on('close', () => {
});
exports.default = app;

