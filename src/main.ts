import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/style/index.less";
const routes = [
  { path: "/", component: () => import("./views/home/Index.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).use(ElementPlus).mount("#app");
