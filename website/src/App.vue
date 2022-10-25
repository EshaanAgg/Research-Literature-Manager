<script setup>
import { RouterView } from "vue-router";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";
import { sidebarWidth } from "@/components/sidebar/state";
</script>

<template>
  <div>
    <SidebarComponent></SidebarComponent>
    <div :style="{ 'margin-left': sidebarWidth }">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
