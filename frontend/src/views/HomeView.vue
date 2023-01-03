<template>
  <div class="container__col">
    <h2 class="titre__secondaire w100">Bienvenue !</h2>
    <p class="text">
      Groupomania vous souhaite la bienvenue sur votre réseau social
      d'entreprise.
    </p>
    <p class="text">
      En créant un compte puis en vous connectant, vous pourrez échanger avec
      vos collègues, prendre connaissance des dernières actualités de
      l'entreprise et réagir aux différents posts.
    </p>
    <p class="text">
      Si vous n'avez pas encore de compte, cliquer sur "Créer un compte" puis
      laissez-vous guider, si vous avez déjà effectué cette démarche alors il
      vous suffit de cliquer sur "Se connecter".
    </p>
    <div class="container__col w100">
      <router-link :to="{ name: 'SignUp' }" class="bouton__principal"
        >Créer un compte</router-link
      >
      <router-link :to="{ name: 'Login' }" class="bouton__principal"
        >Se connecter</router-link
      >
    </div>
  </div>
</template>

<script></script>
