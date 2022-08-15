import { createApp } from "vue";
import { asyncHandleInstance } from "app_alegra_commons/config";
import App from "./App.vue";
import routes from "@/micro/router/index";
import "../node_modules/@alegradev/smile-ui-next/dist/style.css";
import "./index.css";

const app = createApp(App);
asyncHandleInstance(app, { routes: routes });
app.mount("#app");
