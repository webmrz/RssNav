<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="logo-container">
        <img src="/icon/logo.png" alt="logo" class="logo" />
        <div class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
      <div class="loading-text">
        <span class="greeting">{{ greeting }}</span>
        <span class="tip">{{ tip }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getGreeting } from '@/utils/timeTools';

const greeting = ref('');
const tip = ref('正在加载中...');

onMounted(() => {
  greeting.value = getGreeting();
  // 随机显示不同的提示语
  const tips = [
    '正在加载中...',
    '准备就绪...',
    '即将完成...',
    '马上就好...',
    '加载资源中...'
  ];
  tip.value = tips[Math.floor(Math.random() * tips.length)];
});
</script>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--body-background-color);
  color: var(--main-text-color);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.logo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 100px;
  height: 100px;
  animation: logo-breathe 3s infinite alternate;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--main-text-color);
  opacity: 0.6;
  animation: dot-bounce 1.4s infinite ease-in-out;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  .greeting {
    font-size: 20px;
    font-weight: 500;
    opacity: 0.9;
  }
  
  .tip {
    font-size: 16px;
    opacity: 0.7;
  }
}

@keyframes logo-breathe {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style> 