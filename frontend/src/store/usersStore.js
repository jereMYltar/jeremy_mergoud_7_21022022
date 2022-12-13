import { defineStore } from "pinia";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    activeUser: null,
  }),
  getters: {},
  actions: {
    storeActiveUser(payload) {
      this.activeUser = payload;
    },
    addUsers(payload) {
      this.users = payload;
    },
  },
});
