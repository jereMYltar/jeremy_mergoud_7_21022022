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

// Add a response interceptor
apiUsers.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('réponse ok, en cours. Statut : ' + response.status);
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
      console.log('erreur interceptée. Statut : ' + error.response.status);
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
    // return Promise.reject(error);
  });

export default {
  login(userData) {
    return apiUsers.post("/connection/login", userData);
  },
  signUp(userData) {
    return apiUsers.post("/connection/signup", userData);
  },
};

