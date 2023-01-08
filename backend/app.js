const express = require("express");
//Création d'une application Express, via la fonction express() du module Express. Celle-ci sera utilisée comme serveur
const app = express();

//JSON : permettre l'interpretation des requêtes entrantes avec des payloads JSON
app.use(express.json());

//helmet : securiser l'application express en renseignant automatiquement des headers HTTP
const helmet = require("helmet");
app.use(helmet());

//CORS : permettre le partage des ressources entre origine multiple
const cors = require("cors");
app.use(cors());

//rate-limiter : limiter le nombre de connexion au serveur par fenêtre de temps
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
  max: 200, // limite chaque IP à 200 requêtes par fenêtre de temps windowMs
  message: "Too many request. Try again after 15 minutes",
});
app.use(limiter);

//middleware pour savoir si l'utilisateur est connecté
const isConnected = require("./policies/isConnected");

//Implémentation des routes
//utilisateurs
const userRoutes = require("./route/user.route");
app.use("/api/user", userRoutes);
//messages
const messageRoutes = require("./route/message.route");
app.use("/api/message", isConnected, messageRoutes);
//conversations
const conversationRoutes = require("./route/conversation.route");
app.use("/api/conversation", isConnected, conversationRoutes);

module.exports = app;
