import axios from "axios";

const apiUsers = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  login(userData) {
    return apiUsers.post("/connection/login", userData);
  },
  signUp(userData) {
    return apiUsers.post("/connection/signup", userData);
  },
};
