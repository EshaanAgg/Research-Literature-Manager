<script setup>
import constants from "../../constants.json";
document.title = `${constants["website-title"]} | Home`;
</script>

<template>
  <div>
    <h1>{{ constants["home-title"] }}</h1>
    <br />
    <p>{{ constants["home-description"] }}</p>
  </div>
</template>
