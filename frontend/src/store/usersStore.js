import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  //state
  const users = ref([]);
  const activeUser = ref({
    id: 0,
    name: 0,
    isAdmin: 0,
  });
  //getters
  //actions
  function addActiveUser(payload) {
    this.activeUser = payload;
  }
  function addUsers(payload) {
    this.users = payload;
  }
  return { users, activeUser, addActiveUser, addUsers };
});
