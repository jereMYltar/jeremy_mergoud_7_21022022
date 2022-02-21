//Import du module de base de Node intitulé http
const http = require('http');
//Import du module personnalisé app.js
const app = require('./app');

//Définition d'une fonction renvoyant un port valide, qu'il soit fourni sous la forme d'un Number ou d'un String
const normalizePort = val => {
const port = parseInt(val, 10);
if (isNaN(port)) {
   return val;
}
if (port >= 0) {
   return port;
}
return false;
};
//Application de la fonction normalizePort à la variable d'environnement du port ou au port 3000
const port = normalizePort(process.env.PORT || '3000');

// Spécification à l'application Express du port utilisé
//app.set('port', port)

//Définition de la fonction permettant de chercher les erreurs puis de les traiter de manière appropriée
const errorHandler = error => {
if (error.syscall !== 'listen') {
throw error;
}
const address = server.address();
const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
switch (error.code) {
   case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
   case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
   default:
      throw error;
}
};

//Appel à la fonction de base du module http qui créée le serveur, ici à partir de l'application Express
const server = http.createServer(app);

//eventHandler permettant d'indiquer en cas d'erreur du serveur la nature de l'erreur en faisant appel à la fonction errorHandler
server.on('error', errorHandler);
//eventHandler permettant d'indiquer dans la console sur quel port ou via quel pipe le serveur "écoute"
server.on('listening', () => {
const address = server.address();
const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
console.log('Listening on ' + bind);
});

//Indication au serveur du port sur lequel il doit écouter
server.listen(port);
