import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import "./assets/main.css";

// Using icons
import {
  faAnglesLeft,
  faAnglesRight,
  faHome,
  faBook,
  faQuestionCircle,
  faFileImport,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";
library.add([
  faAnglesRight,
  faAnglesLeft,
  faHome,
  faBook,
  faQuestionCircle,
  faFileImport,
  faBackward,
]);

const app = createApp(App);
app.use(router).component("fontAwesomeIcon", FontAwesomeIcon).mount("#app");
