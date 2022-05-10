const express = require("express");
//Création d'une application Express, via la fonction express() du module Express. Celle-ci sera utilisée comme serveur
const app = express();

//JSON
app.use(express.json());

//helmet
const helmet = require("helmet");
app.use(helmet());

// //CORS
const cors = require("cors");
app.use(cors());

// //rate-limiter
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many request. Try again after 15 minutes'
});
app.use(limiter);

//Implémentation des routes
const userRoutes = require('./route/user.route');
app.use('/api/user', userRoutes);
const connectionRoutes = require('./route/connection.route');
app.use('/api/connection', connectionRoutes);


module.exports = app;
