<template>
  <!-- 时间 -->
  <div
    :class="[
      'time-component',
      status.siteStatus,
      status.mainBoxBig && status.siteStatus !== 'normal' && status.siteStatus !== 'focus'
        ? 'hidden'
        : null,
      set.showLunar ? 'lunar' : null,
      set.timeStyle,
    ]"
    @click.stop
  >
    <div
      class="time-container"
      @click.stop="
        status.setSiteStatus(
          status.siteStatus !== 'normal' && status.siteStatus !== 'focus' ? 'normal' : 'box',
        )
      "
    >
      <div class="time">
        <div class="time-main">
          <span class="hour">{{ timeData.hour ?? "00" }}</span>
          <span class="separator" :key="set.showSeconds">:</span>
          <span class="minute">{{ timeData.minute ?? "00" }}</span>
          <Transition name="fade" mode="out-in">
            <span v-if="set.showSeconds" class="second">
              <span class="separator">:</span>
              <span class="second-num">{{ timeData.second ?? "00" }}</span>
            </span>
          </Transition>
          <template v-if="set.use12HourFormat">
            <span class="amPm">{{ timeData.amPm ?? "am" }}</span>
          </template>
        </div>
        <div class="date-info">
          <div class="date">
            <span v-if="set.showYear" class="year">{{ timeData.year ?? "2024" }}</span>
            <span v-if="set.showYear" class="separator">/</span>
            <span class="month">{{ timeData.month ?? "0" }}</span>
            <span class="separator">/</span>
            <span class="day">{{ timeData.day ?? "0" }}</span>
          </div>
          <div class="weekday">{{ timeData.weekday ?? "星期八" }}</div>
        </div>
      </div>
      <div v-if="set.showLunar" class="lunar-info">
        <span class="year">{{ timeData.lunar?.GanZhiYear }}</span>
        <span class="text">{{ timeData.lunar?.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/timeTools";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { statusStore, setStore } from "@/stores";

const set = setStore();
const status = statusStore();

// 时间数据
const timeData = ref({});
const timeInterval = ref(null);

// 更新时间
const updateTimeData = () => {
  timeData.value = getCurrentTime(set.showZeroTime, set.use12HourFormat);
};

// 监听配置发生改变
watch(
  () => [set.showZeroTime, set.use12HourFormat, set.showYear],
  () => {
    updateTimeData();
  },
);

onMounted(() => {
  // 时间
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.time-component {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  transform: translateY(-140px);
  color: var(--main-text-color);
  animation: fade-time-in 0.6s cubic-bezier(0.21, 0.78, 0.36, 1);
  transition: all 0.3s ease;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  
  .time-container {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    padding: 16px 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.05);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    
    .time-main {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 3.5rem;
      font-weight: 300;
      text-shadow: var(--main-text-shadow);
      
      .separator {
        opacity: 0.8;
        font-size: 3.3rem;
        display: inline-block;
        margin: 0 2px;
        transform: translateY(-4px);
        animation: separator-breathe 1.2s infinite alternate;
      }
      
      .amPm {
        font-size: 1.2rem;
        opacity: 0.6;
        margin-left: 8px;
        align-self: flex-start;
        margin-top: 8px;
      }
    }
    
    .date-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.1rem;
      opacity: 0.9;
      
      .date {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .year {
          font-weight: 500;
        }
        
        .separator {
          opacity: 0.6;
        }
      }
      
      .weekday {
        padding: 3px 10px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
      }
    }
  }
  
  .lunar-info {
    margin-top: 12px;
    font-size: 0.9rem;
    opacity: 0.7;
    text-shadow: var(--main-text-shadow);
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    transition: all 0.3s ease;
    text-align: center;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    .year {
      margin-right: 6px;
      font-weight: 500;
    }
  }

  &.focus {
    transform: translateY(-180px);
  }
  
  &.box,
  &.set {
    transform: translateY(-34vh);
    @media (max-width: 478px) {
      transform: translateY(-32vh);
    }
  }
  
  &.hidden {
    transform: translateY(-180px);
    opacity: 0;
  }
  
  &.lunar {
    margin-bottom: 40px;
  }
}

@keyframes separator-breathe {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-time-in {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(-140px);
  }
}
</style>
