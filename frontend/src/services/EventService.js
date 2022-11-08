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
    return apiUsers.post("/conversation/", payload)
  },
  getAllConversationsForCurrentUser() {
    return apiUsers.get("/conversation/user");
  },
  //message
  getAllMessagesByConversationId(payload) {
    return apiUsers.get(`/message/conversation/${payload}`)
  },
  sendMessage(conversationId, payload) {
    return apiUsers.post(`/message/conversation/${conversationId}`, payload);
  },
  moderateMessage(payload) {
    return apiUsers.put(`/message/moderate/${payload}`);
  },
  restoreMessage(payload) {
    return apiUsers.put(`/message/restore/${payload}`);
  },
  //user
  getAllUsers() {
    return apiUsers.get("/user/all");
  },
};

// export default apiUsers

