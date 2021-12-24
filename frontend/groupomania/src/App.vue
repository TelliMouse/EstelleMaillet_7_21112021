<template>
  <div id="body">
    <router-view></router-view>
  </div>
</template>

<style>
@font-face {
  font-family: "Playfair Regular";
  src: url("../src/assets/PlayfairDisplay-Regular.otf") format("opentype");
}

@font-face {
  font-family: "Source Sans Pro Regular";
  src: url('../src/assets/SourceSansPro-Regular.otf') format("opentype");
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Regular', serif;
}

div#body {
  font-family: 'Source Sans Pro Regular', sans-serif;
}
</style>

<script>
export default {
  name: 'App'
}
</script>
