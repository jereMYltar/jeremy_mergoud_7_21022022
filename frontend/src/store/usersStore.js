// Pinia : définition du store des utilisateurs
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
  // fonction mettant à jour un utilisateur en fonction de données transmises
  // - si elles correspondent au state activeUser alors il est mis à jour
  // - puis il y a vérification si l'utilisateur concerné est contenu dans le state users, alors il est mis à jour
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
  // fonction stockant des données(un utilisateur) dans le state activeUser
  function addActiveUser(payload) {
    this.activeUser = payload;
  }
  // fonction stockant des données (un tableau d'utilisateurs) dans le state users
  function addUsers(payload) {
    this.users = payload;
  }
  // fonction stockant des données(un utilisateur) dans le state userWatched (ce qui permet de consulter le détail d'un compte)
  function addUserWatched(payload) {
    this.userWatched = payload;
  }
  // fonction retirant les données stockées dans le state userWatched
  function removeUserWatched() {
    this.userWatched = {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      isAdmin: "",
    };
  }
  // fonction permettant de trier un tableau d'objets (users) en fonction de la clef "name" de ceux-ci (par ordre alphabétique)
  function sortUserArray(array) {
    array.sort((a, b) => a.name.localeCompare(b.name));
  }
  // renvoi des éléments (states, getters et actions disponibles à l'extérieur du module)
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
