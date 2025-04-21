<template>
  <!-- 捷径 -->
  <div class="shortcut__layout">
    <Transition name="fade" mode="out-in">
      <div v-if="shortcutData[0]" class="shortcut">
        <n-scrollbar class="scrollbar">
          <n-grid
            class="all-shortcut"
            responsive="screen"
            cols="4 s:5 m:6 l:8"
            :x-gap="8"
            :y-gap="8"
          >
            <n-grid-item
              v-for="item in shortcutData"
              :key="item.id"
              class="shortcut-item"
              @contextmenu="shortCutContextmenu($event, item)"
              @click="shortCutJump(item.url)"
              @mouseenter="handleHover(item)"
              @mouseleave="handleLeave"
            >
              <div class="shortcut-item__content">
                <div class="shortcut-item__icon" :style="{ backgroundColor: item.color }">
                  <img v-if="item.icon" :src="item.icon" :alt="item.name" />
                  <SvgIcon v-else iconName="icon-link" />
                </div>
                <span class="name">{{ item.name }}</span>
                <span v-if="item.description" class="description">{{ item.description }}</span>
              </div>
            </n-grid-item>
            <n-grid-item
              class="shortcut-item add-item"
              @contextmenu="(e) => e.preventDefault()"
              @click="() => openAddShortcutModal(true, 'add')"
            >
              <div class="shortcut-item__content">
                <div class="shortcut-item__icon">
                  <SvgIcon iconName="icon-add" />
                </div>
                <span class="name">添加捷径</span>
              </div>
            </n-grid-item>
          </n-grid>
        </n-scrollbar>
      </div>
      <div v-else class="not-shortcut">
        <span class="tip">暂无捷径，去添加吧</span>
        <n-button strong secondary @click="() => openAddShortcutModal(true, 'add')">
          <template #icon>
            <SvgIcon iconName="icon-add" />
          </template>
          添加捷径
        </n-button>
      </div>
    </Transition>
    <!-- <div class="footer__btn-group">
      <div class="footer__btn" @click="downloadHtmlFile">
        <SvgIcon iconName="icon-xiazai" />
        <span class="btnName">下载</span>
      </div>
      <div class="footer__btn" @click="clickFileDom">
        <input type="file" name="上传" id="shortCutUploadInput" />
        <SvgIcon iconName="icon-shangchuan" />
        <span class="btnName">上传</span>
      </div>
    </div> -->
  </div>
  <!-- 添加捷径 -->
  <n-modal
    v-model:show="addShortcutModal"
    preset="card"
    :style="{
      width: '90%',
      maxWidth: '600px',
    }"
    title="添加快捷方式"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-form
      ref="addShortcutFormRef"
      :model="addShortcutValue"
      :rules="addShortcutFormRules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item path="name" label="名称">
        <n-input
          v-model:value="addShortcutValue.name"
          placeholder="请输入名称"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="url" label="链接">
        <n-input
          v-model:value="addShortcutValue.url"
          placeholder="请输入链接"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="icon" label="图标">
        <n-input
          v-model:value="addShortcutValue.icon"
          placeholder="自定义图标链接（可选）"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="category" label="分类">
        <n-select
          v-model:value="addShortcutValue.category"
          :options="site.shortcutCategories.map(cat => ({ label: cat, value: cat }))"
          placeholder="选择分类（可选）"
        />
      </n-form-item>
      <n-form-item path="description" label="描述">
        <n-input
          v-model:value="addShortcutValue.description"
          placeholder="添加描述（可选）"
          @keydown.enter.prevent
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space>
        <n-button @click="() => openAddShortcutModal(false)">取消</n-button>
        <n-button type="primary" @click="addOrEditShortcut">确定</n-button>
      </n-space>
    </template>
  </n-modal>
  <!-- 捷径右键菜单 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="large"
    :x="shortCutDropdownX"
    :y="shortCutDropdownY"
    :options="shortCutDropdownOptions"
    :show="shortCutDropdownShow"
    :on-clickoutside="() => (shortCutDropdownShow = false)"
    @select="shortCutDropdownSelect"
  />
</template>

<script setup lang="ts">
import { ref, nextTick, h, type VNode, computed } from "vue";
import {
  NButton,
  NIcon,
  NPopover,
  NInput,
  NForm,
  NFormItem,
  NSelect,
  NModal,
  NGrid,
  NGridItem,
  NScrollbar,
  NEmpty,
  NText,
  NMenu,
  NDropdown,
  NPopconfirm,
  NSpace,
  type FormRules,
  type FormInst,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { siteStore, setStore, statusStore } from "@/stores";
import type { ShortcutItem } from "@/types";
import { getFavicon, checkFavicon } from "@/utils/faviconTools";
import SvgIcon from "@/components/SvgIcon.vue";
import identifyInput from "@/utils/identifyInput";
import { onMounted, onBeforeUnmount } from "vue";

const set = setStore();
const site = siteStore();
const status = statusStore();
const { shortcutData } = storeToRefs(site);

// 图标渲染
const renderIcon = (icon: string) => {
  return () => h(SvgIcon, { iconName: `icon-${icon}` } as any);
};

// 添加捷径数据
const addShortcutRef = ref<FormInst | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const addShortcutModal = ref(false);
const addShortcutModalType = ref<"add" | "edit">("add");
const addShortcutValue = ref<ShortcutItem>({
  id: 0,
  name: "",
  url: "",
  description: "",
  category: "",
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
});

// 表单验证规则
const addShortcutFormRules: FormRules = {
  name: {
    required: true,
    message: "请输入名称",
    trigger: ["blur", "input"],
  },
  url: {
    required: true,
    message: "请输入链接",
    trigger: ["blur", "input"],
  },
};

// 右键菜单数据
const shortCutDropdownX = ref(0);
const shortCutDropdownY = ref(0);
const shortCutDropdownShow = ref(false);
const shortCutDropdownOptions = [
  {
    label: "编辑",
    key: "edit",
    icon: renderIcon("edit"),
  },
  {
    label: "删除",
    key: "delete",
    icon: renderIcon("delete"),
  },
];

// 悬停效果
const handleHover = (item: any) => {
  // 可以在这里添加悬停动画效果
};

const handleLeave = () => {
  // 可以在这里添加离开动画效果
};

// 关闭搜索框
const closeSearchInput = (check = false) => {
  if (check && !set.autoInputBlur) {
    status.setSiteStatus("focus");
  } else {
    status.setSearchInputValue("");
    status.setSiteStatus("normal");
    searchInputRef.value?.blur();
  }
  status.setEngineChangeStatus(false);
};

// 前往搜索
const toSearch = (val: string, type = 1) => {
  const searchValue = val?.trim();
  // 定义跳转方法
  const jumpLink = (url: string) => {
    if (set.urlJumpType === "href") {
      window.location.href = url;
    } else if (set.urlJumpType === "open") {
      window.open(url, "_blank");
    }
  };
};

// 获取网站 favicon
const getWebsiteFavicon = async (url: string): Promise<string> => {
  const faviconUrl = getFavicon(url);
  return faviconUrl;
  // if (await checkFavicon(faviconUrl)) {
  //   return faviconUrl;
  // }
  // return '';
};

// 添加或编辑捷径
const addOrEditShortcut = async (): Promise<void> => {
  if (addShortcutValue.value.name.trim() === "") {
    window.$message.warning("请输入名称");
    return;
  }
  if (addShortcutValue.value.url.trim() === "") {
    window.$message.warning("请输入链接");
    return;
  }
  if (addShortcutModalType.value === "add") {
    const maxID = Math.max(...site.shortcutData.map((item) => item.id), 0);
    const newShortcut: ShortcutItem = {
      ...addShortcutValue.value,
      id: maxID + 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    // 获取网站 favicon
    const faviconUrl = await getWebsiteFavicon(newShortcut.url);
    if (faviconUrl) {
      newShortcut.icon = faviconUrl;
    }
    site.addShortcut(newShortcut);
    window.$message.success("添加成功");
  } else {
    const updatedShortcut: ShortcutItem = {
      ...addShortcutValue.value,
      updatedAt: new Date().getTime(),
    };
    // // 获取网站 favicon
    // const faviconUrl = await getWebsiteFavicon(updatedShortcut.url);
    // if (faviconUrl) {
    //   updatedShortcut.icon = faviconUrl;
    // }
    site.updateShortcut(updatedShortcut);
    window.$message.success("修改成功");
  }
  addShortcutModal.value = false;
};

// 删除捷径
const delShortcut = (id: number): void => {
  window.$dialog.warning({
    title: "警告",
    content: "确定要删除这个捷径吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      site.deleteShortcut(id);
      window.$message.success("删除成功");
    },
  });
};

// 开启右键菜单
const shortCutContextmenu = (e: MouseEvent, data: any) => {
  e.preventDefault();
  shortCutDropdownShow.value = false;
  // 写入弹窗数据
  addShortcutValue.value = {
    ...data,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : new Date().getTime(),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : new Date().getTime(),
  };
  nextTick().then(() => {
    shortCutDropdownShow.value = true;
    shortCutDropdownX.value = e.clientX;
    shortCutDropdownY.value = e.clientY;
  });
};

// 右键菜单点击
const shortCutDropdownSelect = (key: string) => {
  shortCutDropdownShow.value = false;
  switch (key) {
    case "edit":
      addShortcutModalType.value = "edit";
      addShortcutModal.value = true;
      break;
    case "delete":
      delShortcut(addShortcutValue.value.id);
      break;
    default:
      break;
  }
};

// 捷径跳转
const shortCutJump = (url: string) => {
  const urlRegex = /^(https?:\/\/)/i;
  const urlFormat = urlRegex.test(url) ? url : `//${url}`;
  if (set.urlJumpType === "href") {
    window.location.href = urlFormat;
  } else if (set.urlJumpType === "open") {
    window.open(urlFormat, "_blank");
  }
};

// 打开添加捷径弹窗
const openAddShortcutModal = (show: boolean, type: "add" | "edit" = "add"): void => {
  addShortcutModal.value = show;
  addShortcutModalType.value = type;
  if (show) {
    addShortcutValue.value = {
      id: 0,
      name: "",
      url: "",
      description: "",
      category: "",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
};

// 下载快捷方式数据
const downloadHtmlFile = () => {
  const data = site.shortcutData;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shortcuts_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 点击上传按钮
const clickFileDom = () => {
  const input = document.getElementById('shortCutUploadInput') as HTMLInputElement;
  input?.click();
};

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content) as ShortcutItem[];
      site.setShortcutData(data);
      window.$message.success('导入成功');
    } catch (error) {
      window.$message.error('导入失败，请检查文件格式');
    }
  };
  reader.readAsText(file);
  input.value = ''; // 清空input，允许重复上传同一文件
};

// 监听文件上传
onMounted(() => {
  const input = document.getElementById('shortCutUploadInput');
  input?.addEventListener('change', handleFileUpload);
});

onBeforeUnmount(() => {
  const input = document.getElementById('shortCutUploadInput');
  input?.removeEventListener('change', handleFileUpload);
});

// 导出组件方法
defineExpose({
  openAddShortcutModal,
  addOrEditShortcut,
  delShortcut,
  shortCutJump,
  downloadHtmlFile,
  clickFileDom,
});
</script>

<style lang="scss" scoped>
.shortcut__layout {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--main-background-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.shortcut {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding: 16px;
  padding-bottom: 60px;
}

.scrollbar {
  height: 100%;
  padding-right: 10px;
}

.all-shortcut {
  padding: 0;
  gap: 8px !important;
}

.shortcut-item {
  cursor: pointer;
  transition: all 0.2s ease;
  aspect-ratio: 1;
  
  &:hover {
    transform: translateY(-2px);
    .shortcut-item__content {
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    height: 100%;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &__icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 4px;
    }
    
    :deep(svg) {
      width: 16px;
      height: 16px;
      color: var(--main-text-color);
    }
  }
  
  .name {
    font-size: 11px;
    font-weight: 500;
    color: var(--main-text-color);
    margin-bottom: 1px;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .description {
    font-size: 10px;
    color: var(--main-text-color-2);
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.add-item {
  .shortcut-item__content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.15);
  }
  
  .shortcut-item__icon {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    .shortcut-item__content {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.not-shortcut {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  
  .tip {
    font-size: 16px;
    color: var(--main-text-color-2);
    text-align: center;
  }
  
  .n-button {
    padding: 0 24px;
    height: 40px;
    font-size: 15px;
    border-radius: 8px;
  }
}

.footer__btn-group {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  .footer__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    
    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    :deep(svg) {
      width: 16px;
      height: 16px;
      color: var(--main-text-color);
      opacity: 0.8;
      transition: all 0.2s ease;
    }
    
    .btnName {
      font-size: 13px;
      color: var(--main-text-color);
      opacity: 0.8;
      transition: all 0.2s ease;
    }
    
    &:hover {
      :deep(svg),
      .btnName {
        opacity: 1;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 添加捷径弹框样式
:deep(.n-modal) {
  .n-card {
    background: var(--main-background-color);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    
    .n-card-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .n-card-header__main {
        font-size: 18px;
        font-weight: 500;
        color: var(--main-text-color);
      }
    }
    
    .n-card__content {
      padding: 24px;
    }
    
    .n-card__footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
  
  .n-form {
    .n-form-item {
      margin-bottom: 20px;
      
      .n-form-item-label {
        font-size: 15px;
        color: var(--main-text-color);
      }
      
      .n-input {
        height: 40px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        &:focus {
          border-color: var(--main-color);
          box-shadow: 0 0 0 2px rgba(var(--main-color-rgb), 0.2);
        }
      }
    }
  }
  
  .n-button {
    height: 40px;
    padding: 0 24px;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s ease;
    
    &--primary {
      background: var(--main-color);
      
      &:hover {
        background: var(--main-color-hover);
      }
    }
  }
}
</style>
