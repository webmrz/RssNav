<template>
  <!-- 全局配置组件 -->
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
    abstract
    inline-theme-disabled
  >
    <n-message-provider>
      <n-loading-bar-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <slot />
            <NaiveProviderContent />
          </n-notification-provider>
        </n-dialog-provider>
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { defineComponent, h } from "vue";
import type { GlobalThemeOverrides } from "naive-ui";
import {
  zhCN,
  dateZhCN,
  darkTheme,
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider,
  useDialog,
  useNotification,
  useMessage,
} from "naive-ui";

// 全局主题
const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily: "'HarmonyOS_Regular', sans-serif",
    primaryColor: "#ffffff",
    primaryColorHover: "#ffffff70",
    primaryColorSuppl: "#ffffff30",
    primaryColorPressed: "#ffffff30",
  },
};

// 挂载 Naive 组件
const setupNaiveTools = (): void => {
  // 通知
  window.$notification = useNotification();
  // 信息
  window.$message = useMessage();
  // 对话框
  window.$dialog = useDialog();
};

// Naive 功能组件
const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools();
  },
  render() {
    return h("div", { className: "main-tools" });
  },
});
</script>
