const express = require("express");
//Création d'une application Express, via la fonction express() du module Express. Celle-ci sera utilisée comme serveur
const app = express();

//JSON
app.use(express.json());

//helmet
const helmet = require("helmet");
app.use(helmet());

//CORS
const cors = require("cors");
app.use(cors());

//rate-limiter
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre de temps windowMs
  message: 'Too many request. Try again after 15 minutes'
});
app.use(limiter);

//test pour savoir si l'utilisateur est connecté
const isConnected = require("./middleware/isConnected");

//Implémentation des routes
const userRoutes = require('./route/user.route');
app.use('/api/user', isConnected, userRoutes);
const connectionRoutes = require('./route/connection.route');
app.use('/api/connection', connectionRoutes);
const messageRoutes = require('./route/message.route');
app.use('/api/message', isConnected, messageRoutes);
const conversationRoutes = require('./route/conversation.route');
app.use('/api/conversation', isConnected, conversationRoutes);


module.exports = app;
