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
  //user
  login(payload) {
    return apiUsers.post("/user/login", payload);
  },
  signUp(payload) {
    return apiUsers.post("/user/signup", payload);
  },
  getAllOtherUsers() {
    return apiUsers.get("/user/other");
  },
  getCurrentUser() {
    return apiUsers.get("/user/");
  },
  //conversation
  // createConversation(payload) {
  //   return apiUsers.post("/conversation/", payload);
  // },
  upsertConversation(payload) {
    return apiUsers.post("/conversation/new", payload);
  },
  getAllConversationsForCurrentUser() {
    return apiUsers.get("/conversation/");
  },
  getConversationDetail(conversationId) {
    return apiUsers.get(`/conversation/details/${conversationId}`)
  },
  updateConversation(conversationId, payload) {
    return apiUsers.put(`/conversation/${conversationId}`, payload);
  },
  // updateTimestampConversation(conversationId) {
  //   return apiUsers.put(`/conversation/timestamp/${conversationId}`);
  // },
  deleteConversation(conversationId) {
    return apiUsers.delete(`/conversation/${conversationId}`);
  },
  //user_conversation
  // getConversationMembers(conversationId) {
  //   return apiUsers.get(`/user_conversation/${conversationId}`);
  // },
  // updateConversationMembers(conversationId, payload) {
  //   return apiUsers.put(`/user_conversation/${conversationId}`, payload);
  // },
  //message
  getAllMessagesByConversationId(conversationId) {
    return apiUsers.get(`/message/conversation/${conversationId}`);
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
  deleteMessage(messageId) {
    return apiUsers.delete(`/message/${messageId}`);
  },
};

// export default apiUsers

