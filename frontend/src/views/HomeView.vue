<template>
  <div class="main1 container">
    <h2 class="titre1">Bienvenue !</h2>
    <p class="text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
    <div class="container">
      <router-link :to="{ name: 'SignUp' }" class="basicButton"
        >Créer un compte</router-link
      >
      <router-link :to="{ name: 'Login' }" class="basicButton"
        >Se connecter</router-link
      >
    </div>
  </div>
</template>

<script></script>
