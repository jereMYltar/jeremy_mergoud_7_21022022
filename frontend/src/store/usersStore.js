import { defineStore } from "pinia";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    activeUser: null,
  }),
  getters: {},
  actions: {
    storeIsActiveUserAdmin(payload) {
      this.activeUser = {
        isAdmin: payload,
      };
    },
    addUsers(payload) {
      this.users = payload;
    },
  },
});
