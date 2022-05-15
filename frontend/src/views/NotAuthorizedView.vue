<template>
  <div class="main1 container">
    <h1 class="titre1">Pas pour l'instant !</h1>
    <h2 class="titre2">
      Vous n'êtes pas autorisé à continuer.
      <a href="#" @click="$router.go(-1)" class="littleButton">cliquez ici</a>
      pour revenir en arrière.
    </h2>
  </div>
</template>
