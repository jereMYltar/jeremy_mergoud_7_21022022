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
  const userWatched = ref({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: "",
  });
  //getters
  //actions
  function updateUsersStore(payload) {
    if (!activeUser.value.id || payload.id == activeUser.value.id) {
      activeUser.value = payload;
    }
    const index = users.value.findIndex((user) => user.id == payload.id);
    if (index != -1) {
      users.value[index].name = payload.name;
      users.value[index].isAdmin = payload.isAdmin;
    }
    sortUserArray(users.value);
  }
  function addActiveUser(payload) {
    this.activeUser = payload;
  }
  function addUsers(payload) {
    this.users = payload;
  }
  function addUserWatched(payload) {
    this.userWatched = payload;
  }
  function removeUserWatched() {
    this.userWatched = {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      isAdmin: "",
    };
  }
  function sortUserArray(array) {
    array.sort((a, b) => a.name.localeCompare(b.name));
  }
  return {
    users,
    activeUser,
    userWatched,
    addActiveUser,
    addUsers,
    addUserWatched,
    removeUserWatched,
    updateUsersStore,
  };
});
