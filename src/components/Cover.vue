<template>
  <div :class="status.siteStatus !== 'normal' ? 'cover focus' : 'cover'">
    <img
      v-show="status.imgLoadStatus"
      class="background"
      alt="background"
      :src="bgUrl"
      :style="{ '--blur': set.backgroundBlur + 'px' }"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />
    <Transition name="fade">
      <div v-if="set.showBackgroundGray" class="gray" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { statusStore, setStore } from "@/stores";

const set = setStore();
const status = statusStore();
const bgUrl = ref<string>("");
const imgTimeout = ref<number | null>(null);
const retryCount = ref<number>(0);
const maxRetries = 3;
const imageCache = new Map<string, string>();
const emit = defineEmits<{
  (e: 'loadComplete'): void
}>();

// 壁纸随机数
// 请依据文件夹内的图片个数修改 Math.random() 后面的第一个数字
const bgRandom = Math.floor(Math.random() * 3 + 1);

// 预加载图片
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
};

// 获取动漫图片
const getAnimeImage = async (): Promise<string> => {
  const cacheKey = 'anime';
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    const url = "https://api.yimian.xyz/img?type=acg&size=1920x1080";
    await preloadImage(url);
    imageCache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Failed to fetch anime image:", error);
    throw error;
  }
};

// 获取风景图片
const getSceneryImage = async (): Promise<string> => {
  const cacheKey = 'scenery';
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    const url = "https://api.yimian.xyz/img?type=moe&size=1920x1080";
    await preloadImage(url);
    imageCache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error("Failed to fetch scenery image:", error);
    throw error;
  }
};

// 获取必应每日一图
const getBingImage = async (): Promise<string> => {
  const isMobile = window.innerWidth < 768;
  const url = `https://api.dujin.org/bing/${isMobile ? "m" : "1920"}.php`;
  await preloadImage(url);
  return url;
};

// 赋值壁纸
const setBgUrl = async (): Promise<void> => {
  const { backgroundType } = set;
  try {
    let newUrl: string;

    switch (backgroundType) {
      case 0:
        newUrl = `/background/bg${bgRandom}.jpg`;
        break;
      case 1:
        newUrl = await getBingImage();
        break;
      case 2:
        newUrl = await getSceneryImage();
        break;
      case 3:
        newUrl = await getAnimeImage();
        break;
      case 4:
        newUrl = set.backgroundCustom;
        break;
      default:
        newUrl = `/background/bg${bgRandom}.jpg`;
        break;
    }

    // 预加载新图片
    await preloadImage(newUrl);
    bgUrl.value = newUrl;
  } catch (error) {
    console.error("Failed to set background:", error);
    if (retryCount.value < maxRetries) {
      retryCount.value++;
      console.log(`Retrying... (${retryCount.value}/${maxRetries})`);
      await setBgUrl();
    } else {
      window.$message.error("壁纸加载失败，已临时切换回默认");
      // 立即切换到默认壁纸，不等待加载
      bgUrl.value = `/background/bg${bgRandom}.jpg`;
      // 确保页面可以正常加载
      status.setImgLoadStatus(true);
      retryCount.value = 0;
    }
  }
};

// 图片加载完成
const imgLoadComplete = (): void => {
  if (imgTimeout.value) {
    clearTimeout(imgTimeout.value);
  }
  
  imgTimeout.value = window.setTimeout(
    () => {
      status.setImgLoadStatus(true);
      retryCount.value = 0;
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

// 图片动画完成
const imgAnimationEnd = (): void => {
  console.log("壁纸加载且动画完成");
  // 加载完成事件
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = async (): Promise<void> => {
  console.error("壁纸加载失败：", bgUrl.value);
  if (retryCount.value < maxRetries) {
    retryCount.value++;
    console.log(`Retrying... (${retryCount.value}/${maxRetries})`);
    await setBgUrl();
  } else {
    window.$message.error("壁纸加载失败，已临时切换回默认");
    // 立即切换到默认壁纸，不等待加载
    bgUrl.value = `/background/bg${bgRandom}.jpg`;
    // 确保页面可以正常加载
    status.setImgLoadStatus(true);
    retryCount.value = 0;
  }
};

onMounted(async () => {
  await setBgUrl();
});

onBeforeUnmount(() => {
  if (imgTimeout.value) {
    clearTimeout(imgTimeout.value);
  }
  // 清理图片缓存
  imageCache.clear();
});
</script>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--body-background-color);
  overflow: hidden;
  
  &.focus {
    .background {
      filter: blur(calc(var(--blur) + 10px)) brightness(0.8);
      transform: scale(1.3);
    }
  }

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    transform: scale(1.2);
    filter: blur(var(--blur));
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, filter;
  }

  .gray {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
    pointer-events: none;
  }
}
</style>
