/* eslint-disable */
import axios from "axios";
import router from "@/router";

const apiUsers = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiUsers.interceptors.request.use(function (config)
{
  const token = sessionStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : 'invalid token';
  return config;
});

// Add a response interceptor
apiUsers.interceptors.response.use(
  (response) => {
    if (response.data.customMessage) {
      console.log(response.data.customMessage);
    };
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
      if (error.response.status == 401) {
        router.push({
          name: "NotAuthorized",
        });
      } else if (error.response.status == 403) {
        router.push({
          name: "NotAuthorized",
        });
      } else if (error.response.status == 404) {
        router.push({
          name: "404Resource",
        });
      } else if (error.response.status == 498) {
        alert("Votre connexion a expiré. Veuillez vous authentifier à nouveau.")
        sessionStorage.clear();
        router.push({
          name: "Login",
        });
      } else {
        router.push({ name: "NetworkError" });
      }
    return Promise.reject();
  });

export default {
  //login
  login(payload) {
    return apiUsers.post("/connection/login", payload);
  },
  //sigup
  signUp(payload) {
    return apiUsers.post("/connection/signup", payload);
  },
  //conversation
  createConversation(payload) {
    return apiUsers.post("/conversation/", payload);
  },
  getAllConversationsForCurrentUser() {
    return apiUsers.get("/conversation/");
  },
  //message
  getAllMessagesByConversationId(payload) {
    return apiUsers.get(`/message/conversation/${payload}`);
  },
  sendMessage(conversationId, payload) {
    return apiUsers.post(`/message/conversation/${conversationId}`, payload);
  },
  updateMessage(messageId, payload) {
    return apiUsers.put(`/message/${messageId}`, payload);
  },
  moderateMessage(messageId, payload, conversationId) {
    return apiUsers.put(`/message/${messageId}/${conversationId}`, payload);
  },
  deleteMessage(payload) {
    return apiUsers.delete(`/message/${payload}`);
  },
  //user
  getAllOtherUsers() {
    return apiUsers.get("/user/other");
  },
  getAdminInfoForCurrentUser() {
    return apiUsers.get("/user/");
  }
};

// export default apiUsers

