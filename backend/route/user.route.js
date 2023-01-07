const express = require("express");
const router = express.Router();
const UserCtrl = require("../controller/user.controller.js");
const validatePassword = require("../middleware/validatePassword");
//middleware pour savoir si l'utilisateur est connecté
const isConnected = require("../policies/isConnected");
//test pour savoir si l'utilisateur a le droit d'action sur le compte
const isAccountOwnerOrAdmin = require("../policies/isAccountOwnerOrAdmin");

//CREATE : créer un nouvel utilisateur
router.post("/upsertUser", validatePassword, UserCtrl.upsertUser);

//READ : permettre la connexion d'un utilisateur créé en renvoyant le token d'authentification
router.post("/login", UserCtrl.login);

// READ : récupérer un utilisateur spécifique
router.get("/", isConnected, UserCtrl.findOneByToken);

// READ : récupérer un utilisateur spécifique
router.get(
  "/details/:userId",
  isConnected,
  isAccountOwnerOrAdmin,
  UserCtrl.findUserDetails
);

// READ : récupérer tous les utilisateurs
router.get("/other", isConnected, UserCtrl.findAllOtherUsers);

//DELETE : supprimer un utilisateur
router.delete(
  "/:userId",
  isConnected,
  isAccountOwnerOrAdmin,
  UserCtrl.deleteOne
);
module.exports = router;
