import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import "./assets/main.css";

// Using icons
import {
  faAnglesLeft,
  faHome,
  faBook,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
library.add([faAnglesLeft, faHome, faBook, faQuestionCircle]);

const app = createApp(App);
app.use(router).component("fontAwesomeIcon", FontAwesomeIcon).mount("#app");
