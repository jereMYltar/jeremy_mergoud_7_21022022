<template>
  <form @submit.prevent="connect">
    <p>
      <label for="id-connection">Id de connection</label>
      <input
        v-model="user.id"
        id="id-connection"
        type="text"
        maxlength="255"
        placeholder="Votre identifiant de connexion"
      />
    </p>
    <p>
      <label for="mdp">Id de connexion</label>
      <input
        v-model="user.mdp"
        id="mdp"
        type="text"
        maxlength="255"
        placeholder="Votre mot de passe"
      />
    </p>
    <button type="submit">Se connecter</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      user: {
        id: "",
        mdp: "",
      },
    };
  },
  methods: {
    connect() {
      console.log(this.user.id + " " + this.user.mdp);
    },
  },
};
</script>
