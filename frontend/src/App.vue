<!-- corps de l'application -->
<template>
  <div class="main container__col w80 f1">
    <!-- en-tête -->
    <header class="container__row titre__principal w100" role="banner">
      <img
        src="./assets/Images/Logo/icon-left-font-reduce.svg"
        class="logo"
        aria-hidden="true"
      />
      <h1 class="titre__principal">The social network</h1>
    </header>
    <!-- partie principale renvoyant au router / différentes view -->
    <main class="container container__main w100 f1" role="main">
      <router-view />
    </main>
    <!-- pied de page comportant les informations utiles -->
    <footer class="container__col footer w100">
      <p class="text">Qui sommes nous ? (en construction)</p>
      <p class="text">Accessibilité (en construction)</p>
      <p class="text">Nous contacter (en construction)</p>
    </footer>
  </div>
</template>
