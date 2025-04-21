import { createApp } from "vue";
// Pinia
import pinia from "@/stores";
// IconFont
import SvgIcon from "@/components/SvgIcon.vue";
// 主组件
import App from "@/App.vue";
// 全局样式
import "@/style/global.scss";
// Service Worker
import "@/utils/registerServiceWorker";

// 根组件
const app = createApp(App);

// 挂载
app.use(pinia);
app.component("SvgIcon", SvgIcon);
app.mount("#app"); 