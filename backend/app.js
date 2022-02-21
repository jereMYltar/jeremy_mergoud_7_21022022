require('dotenv').config();
const Sequelize = require('sequelize');
const database = require('./config/database');
//Import du module de base de Node intitulé express
const express = require('express');



database.authenticate()
    .then(() => console.log('Connected to the database !'))
    .catch((error) => console.error('Unable to connect to the database:', error));


//Création d'une application Express, via la fonction express() du module Express. Celle-ci sera utilisée comme serveur
const app = express();

//Ajout des middleware

//Export de l'application Express créée
module.export = app;
