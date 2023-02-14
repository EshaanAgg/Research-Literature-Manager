<script setup>
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import SidebarLink from "./SidebarLink.vue";
import constants from "../../../constants.json";
import url from "../../assets/data/url.json"
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span v-if="collapsed">
        <div>{{ constants["navbar-name-abbreviation"][0] }}</div>
        <div>{{ constants["navbar-name-abbreviation"][1] }}</div>
      </span>
      <span v-else> {{ constants["navbar-name"] }} </span>
    </h1>

    <SidebarLink to="/" icon="home">Home</SidebarLink>
    <SidebarLink to="/papers" icon="book">My Papers</SidebarLink>
    <SidebarLink to="/candidate" icon="question-circle"
      >Candidate Papers</SidebarLink
    >
    <SidebarLink to="/import" icon="file-import"
      >Import from Bib File</SidebarLink
    >

    <br />
    <br />
    <br />
    <SidebarLink :to="url.url" icon="backward"
      >Take me to my Repo</SidebarLink
    >

    <span class="footer">
      <div v-if="!collapsed">
        Create your own living survey using
        <a href="https://github.com/EshaanAgg/Research-Literature-Manager"
          >this template</a
        >
        in under 60 seconds!!!!
      </div>
      <br />
      <span @click="toggleSidebar">
        <fontAwesomeIcon v-if="!collapsed" icon="angles-left"></fontAwesomeIcon>
        <fontAwesomeIcon v-else icon="angles-right"></fontAwesomeIcon>
      </span>
    </span>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #2f855a;
  --sidebar-item-hover: #38a169;
  --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar h1 {
  height: 2.5em;
}
.footer a {
  color: whitesmoke;
  background-color: transparent;
}
.footer {
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s linear;
}
.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>
