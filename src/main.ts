import { createApp } from "vue";
import "./style.css";
import "./styles/cards.css";
import "./styles/vars.css";
import "./styles/lines.css";
import "./styles/inputs.css";
import "./styles/select.css";
import "./styles/filterCard.css";
import App from "./App.vue";
import router from "./router";
const app = createApp(App);

app.use(router);
app.mount("#app");
