<template>
  <div class="all-set">
    <n-tabs class="set" size="large" justify-content="space-evenly" animated>
      <n-tab-pane name="main" tab="基础设置">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> 主题与壁纸 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">主题类别</span>
              <span class="tip">切换全站主题类别</span>
            </div>
            <n-select class="set" v-model:value="themeType" :options="themeTypeOptions" />
          </n-card>
          <n-card
            class="set-item cover"
            :content-style="{
              flexDirection: 'column',
              alignItems: 'flex-start',
            }"
          >
            <div class="desc">
              <div class="name">
                <span class="title">壁纸偏好</span>
                <span class="tip"> 除默认以外的其他选项可能会导致页面载入缓慢 </span>
              </div>
              <n-space>
                <Transition name="fade" mode="out-in">
                  <n-button
                    v-if="backgroundType !== 0"
                    strong
                    secondary
                    @click="changeBackground(0, true)"
                  >
                    恢复默认
                  </n-button>
                </Transition>
                <n-button strong secondary @click="customCoverModal = true">
                  <template v-if="backgroundType === 4" #icon>
                    <SvgIcon iconName="icon-confirm" />
                  </template>
                  {{ backgroundType === 4 ? "已开启自定义" : "自定义" }}
                </n-button>
              </n-space>
            </div>
            <n-grid
              class="cover-selete"
              responsive="screen"
              cols="2 s:3 m:4 l:4"
              :x-gap="16"
              :y-gap="16"
            >
              <n-grid-item
                v-for="(item, index) in backgroundTypeArr"
                :key="index"
                :class="index === backgroundType ? 'item check' : 'item'"
                @click="changeBackground(index as BackgroundType)"
              >
                <span class="name" v-html="item.name" />
              </n-grid-item>
            </n-grid>
          </n-card>
          <n-h6 prefix="bar"> 搜索 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">搜索引擎</span>
              <span class="tip">切换或自定义搜索引擎</span>
            </div>
            <n-button
              strong
              secondary
              @click="
                () => {
                  status.setSiteStatus('focus');
                  status.setEngineChangeStatus(true);
                }
              "
            >
              前往调整
            </n-button>
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">搜索建议</span>
              <span class="tip">是否显示搜索建议</span>
            </div>
            <n-switch v-model:value="showSuggestions" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">跳转方式</span>
              <span class="tip">全站链接跳转方式</span>
            </div>
            <n-select class="set" v-model:value="urlJumpType" :options="urlJumpTypeOptions" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="personalization" tab="个性调整">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> 壁纸 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">壁纸遮罩</span>
              <span class="tip">壁纸周围是否显示暗色遮罩</span>
            </div>
            <n-switch v-model:value="showBackgroundGray" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">壁纸模糊</span>
              <span class="tip">调整壁纸高斯模糊的程度</span>
            </div>
            <n-slider
              class="set"
              v-model:value="backgroundBlur"
              :step="0.01"
              :min="0"
              :max="10"
              :tooltip="false"
            />
          </n-card>
          <n-h6 prefix="bar"> 时间 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">时钟样式</span>
              <span class="tip">选择一种时钟样式</span>
            </div>
            <n-select class="set" v-model:value="timeStyle" :options="timeStyleOptions" />
          </n-card>
          <n-card v-if="timeStyle === 'one'" class="set-item">
            <div class="name">
              <span class="title">时间显秒</span>
              <span class="tip">是否在分钟后面显示秒数</span>
            </div>
            <n-switch v-model:value="showSeconds" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">时钟显零</span>
              <span class="tip">是否在时钟小于 10 时补 0</span>
            </div>
            <n-switch v-model:value="showZeroTime" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">显示农历</span>
            </div>
            <n-switch v-model:value="showLunar" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">12 小时制</span>
            </div>
            <n-switch v-model:value="use12HourFormat" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">显示年份</span>
              <span class="tip">是否在日期中显示年份</span>
            </div>
            <n-switch v-model:value="showYear" :round="false" />
          </n-card>
          <n-h6 prefix="bar"> 搜索框 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">自动收缩</span>
              <span class="tip">是否在非搜索状态时收起搜索框</span>
            </div>
            <n-switch v-model:value="smallInput" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">自动聚焦</span>
              <span class="tip">打开网站时自动聚焦搜索框</span>
            </div>
            <n-switch v-model:value="autoFocus" :round="false" />
          </n-card>
          <n-card class="set-item">
            <div class="name">
              <span class="title">自动失焦</span>
              <span class="tip">跳转搜索后搜索框自动失焦</span>
            </div>
            <n-switch v-model:value="autoInputBlur" :round="false" />
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="other" tab="其他设置">
        <n-scrollbar class="scrollbar">
          <n-h6 prefix="bar"> 重置 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">站点重置</span>
              <span class="tip">若站点显示异常或出现问题时可尝试此操作</span>
            </div>
            <n-button strong secondary @click="resetSite"> 重置 </n-button>
          </n-card>
          <n-h6 prefix="bar"> 备份 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">站点备份</span>
              <span class="tip">将站点配置及个性化内容进行备份</span>
            </div>
            <n-button strong secondary @click="backupSite"> 备份 </n-button>
          </n-card>
          <n-h6 prefix="bar"> 恢复 </n-h6>
          <n-card class="set-item">
            <div class="name">
              <span class="title">数据恢复</span>
              <span class="tip">将备份的站点内容进行恢复</span>
            </div>
            <input
              ref="recoverRef"
              type="file"
              style="display: none"
              accept=".json"
              @change="recoverSite"
            />
            <n-button strong secondary @click="recoverRef?.click()"> 恢复 </n-button>
          </n-card>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    <!-- 自定义壁纸 -->
    <n-modal preset="card" title="自定义壁纸" v-model:show="customCoverModal" :bordered="false">
      <n-form>
        <n-form-item label="自定义壁纸链接">
          <n-input
            clearable
            type="text"
            v-model:value="customCoverUrl"
            placeholder="请输入自定义壁纸链接"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button strong secondary @click="customCoverModal = false"> 取消 </n-button>
          <n-button strong secondary @click="setCustomCover"> 确认 </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  NH6,
  NTabs,
  NTabPane,
  NSpace,
  NCard,
  NSwitch,
  NSelect,
  NScrollbar,
  NButton,
  NGrid,
  NGridItem,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSlider,
  useMessage,
  useDialog,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { setStore, statusStore, siteStore } from "@/stores";
import identifyInput from "@/utils/identifyInput";
import type { ThemeType, BackgroundType, TimeStyle, UrlJumpType } from '@/types'

const set = setStore();
const status = statusStore();
const site = siteStore();
const message = useMessage();
const dialog = useDialog();
const {
  themeType,
  backgroundType,
  backgroundCustom,
  showBackgroundGray,
  backgroundBlur,
  smallInput,
  autoFocus,
  autoInputBlur,
  showLunar,
  showSeconds,
  showZeroTime,
  use12HourFormat,
  showSuggestions,
  urlJumpType,
  timeStyle,
  showYear,
} = storeToRefs(set);
const recoverRef = ref<HTMLInputElement | null>(null);
const customCoverModal = ref(false);
const customCoverUrl = ref("");

// 壁纸类别
const backgroundTypeArr = [
  { name: "本地默认", tip: "默认壁纸，随机更换" },
  { name: "每日必应", tip: "必应每日一图，每天更新" },
  { name: "随机风景", tip: "随机风景图，随机更换" },
  { name: "随机动漫", tip: "随机二次元图，随机更换" },
];

// 主题类别
const themeTypeOptions = [
  {
    label: "浅色模式",
    value: "light" as ThemeType,
  },
  {
    label: "深色模式",
    value: "dark" as ThemeType,
  },
];

// 切换壁纸
const changeBackground = (type: BackgroundType, reset = false) => {
  if (reset) {
    dialog.warning({
      title: "壁纸恢复",
      content: "确认恢复默认壁纸？若当前为自定义壁纸，你的自定义壁纸将丢失！",
      positiveText: "恢复",
      negativeText: "取消",
      onPositiveClick: () => {
        set.setBackgroundType(0);
        message.info("已恢复为默认壁纸，刷新后生效");
      },
    });
    return true;
  }
  set.setBackgroundType(type);
  message.success(`已切换为${backgroundTypeArr[type].name}，刷新后生效`);
};

// 链接跳转方式
const urlJumpTypeOptions = [
  {
    label: "新页面打开",
    value: "open" as UrlJumpType,
  },
  {
    label: "当前页打开",
    value: "href" as UrlJumpType,
  },
];

// 时钟样式
const timeStyleOptions = [
  {
    label: "横向排布",
    value: "one" as TimeStyle,
  },
  {
    label: "竖向排布",
    value: "two" as TimeStyle,
  },
];

// 自定义壁纸
const setCustomCover = () => {
  if (identifyInput(customCoverUrl.value) === "url") {
    set.setBackgroundType(4);
    set.setBackgroundCustom(customCoverUrl.value);
    customCoverModal.value = false;
    message.error("已切换为自定义壁纸，刷新后生效");
  } else {
    message.error("请输入正确的网址");
  }
};

// 站点重置
const resetSite = () => {
  dialog.warning({
    title: "站点重置",
    content: "确认重置站点为默认状态？你的全部数据以及自定义设置都将丢失！",
    positiveText: "重置",
    negativeText: "取消",
    onPositiveClick: () => {
      localStorage.clear();
      message.info("站点重置成功，即将刷新");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });
};

// 站点备份
const backupSite = () => {
  const backupData = {
    settings: set.$state,
    shortcuts: site.shortcutData,
    notes: site.noteData,
    todos: site.todoData,
  };
  const blob = new Blob([JSON.stringify(backupData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `RssNav-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  message.success("站点备份成功");
};

// 站点恢复
const recoverSite = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        if (backupData.settings) {
          Object.assign(set.$state, backupData.settings);
        }
        if (backupData.shortcuts) {
          site.shortcutData = backupData.shortcuts;
        }
        if (backupData.notes) {
          site.noteData = backupData.notes;
        }
        if (backupData.todos) {
          site.todoData = backupData.todos;
        }
        message.success("站点恢复成功，即将刷新");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        message.error("恢复失败，请检查备份文件是否正确");
      }
    };
    reader.readAsText(input.files[0]);
  }
};

onMounted(() => {
  // 检测是否存在自定义壁纸
  if (backgroundCustom.value) customCoverUrl.value = backgroundCustom.value;
});
</script>

<style lang="scss">
.cover-selete {
  margin-top: 12px;
  .item {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--main-background-light-color);
    transition:
      background-color 0.3s,
      box-shadow 0.3s;
    &.check {
      background-color: var(--main-background-hover-color);
      &::before {
        content: "";
        position: absolute;
        border-radius: 12px;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid var(--main-background-hover-color);
        transition: opacity 0.3s;
      }
    }
    &:hover {
      background-color: var(--main-background-hover-color);
      box-shadow: 0 0 0px 2px var(--main-background-hover-color);
      &::before {
        opacity: 0;
      }
    }
    &:active {
      box-shadow: none;
    }
  }
}
</style>
