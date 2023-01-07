// gestion de la connexion serveur
import axios from "axios";
import router from "@/router";

// initialisation d'axios et connexion au serveur
const apiUsers = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// interception des requêtes au serveur pour ajouter le token d'authentification à chacune
apiUsers.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "invalid token";
  return config;
});

// interception des réponses serveurs pour gérer au mieux les réponses
apiUsers.interceptors.response.use(
  // renvoie tous les customMessage contenus dans les réponses dans la console
  (response) => {
    if (response.data.customMessage) {
      console.log(response.data.customMessage);
    }
    return response;
  },
  // gestion distincte de chaque réponse en fonction du code réponse du serveur :
  // - si 400 : affichage d'une alerte avec le contenu de l'erreur
  // - si 401 ou 403 : redirection vers la page "action non autorisée"
  // - si 404 : redirection vers la page "erreur 404"
  // - si 418 ou 423 : affichage d'une alerte avec le contenu de l'erreur
  //      + déconnexion de l'utilisateur et redirection vers la page de connexion
  // - si 500 : affichage d'une alerte avec le contenu de l'erreur
  //      + redirection vers la page "erreur serveur"
  (error) => {
    if (error.response.status == 400) {
      alert(error.response.data.customMessage);
    } else if (error.response.status == 401 || error.response.status == 403) {
      router.push({
        name: "NotAuthorized",
      });
    } else if (error.response.status == 404) {
      router.push({
        name: "404Resource",
      });
    } else if (error.response.status == 418 || error.response.status == 423) {
      alert(error.response.data.customMessage);
      sessionStorage.clear();
      router.push({
        name: "Login",
      });
    } else if (error.response.status == 500) {
      alert(error.response.data.customMessage);
    } else {
      router.push({ name: "NetworkError" });
    }
    return Promise.reject();
  }
);

export default {
  // tous les appels serveurs gérés côté front :
  // 1 - users :
  // pour connecter l'utilisateur
  login(payload) {
    return apiUsers.post("/user/login", payload);
  },
  // pour créer un  nouveau compte utilisateur ou mettre à jour celui existant
  upsertUser(payload) {
    return apiUsers.post("/user/upsertUser", payload);
  },
  // pour récupérer des données sur tous les autres utilisateurs
  getAllOtherUsers() {
    return apiUsers.get("/user/other");
  },
  // pour récupérer des données sur l'utilisateur connecté
  getCurrentUser() {
    return apiUsers.get("/user/");
  },
  // pour récupérer toutes les données d'un utilisateur identifié par son Id (consultation de compte)
  getUserDetails(userId) {
    return apiUsers.get(`/user/details/${userId}`);
  },
  // pour supprimer un compte
  deleteUser(userId) {
    return apiUsers.delete(`/user/${userId}`);
  },
  // 2 - conversations
  // pour créer ou mettre à jour une conversation
  upsertConversation(payload) {
    return apiUsers.post("/conversation/new", payload);
  },
  // pour récupérer toutes les conversations de l'utilisateur actif
  getAllConversationsForCurrentUser() {
    return apiUsers.get("/conversation/");
  },
  // pour récupérer les informations d'une conversation en particulier
  getConversationDetail(conversationId) {
    return apiUsers.get(`/conversation/details/${conversationId}`);
  },
  // pour supprimer une conversation
  deleteConversation(conversationId) {
    return apiUsers.delete(`/conversation/${conversationId}`);
  },
  // 3 - message
  // pour récupérer tous les messages d'une conversation donnée
  getAllMessagesByConversationId(conversationId) {
    return apiUsers.get(`/message/conversation/${conversationId}`);
  },
  // pour créer un message
  sendMessage(conversationId, payload) {
    return apiUsers.post(`/message/conversation/${conversationId}`, payload);
  },
  // pour mettre à jour un message
  updateMessage(messageId, payload) {
    return apiUsers.put(`/message/${messageId}`, payload);
  },
  // pour modérer un message
  moderateMessage(messageId, payload, conversationId) {
    return apiUsers.put(`/message/${messageId}/${conversationId}`, payload);
  },
  // pour supprimer un message
  deleteMessage(messageId) {
    return apiUsers.delete(`/message/${messageId}`);
  },
};
