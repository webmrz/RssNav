<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconClassName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  iconName: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: "i-icon",
});

// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`;
});

// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `i-icon ${props.className}`;
  }
  return "i-icon";
});
</script>

<style lang="scss">
.i-icon {
  width: 1em;
  height: 1em;
  min-width: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
