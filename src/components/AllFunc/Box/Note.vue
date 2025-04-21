<template>
  <div class="note__layout">
    <Transition name="fade" mode="out-in">
      <div v-if="noteData[0]" class="note">
        <n-scrollbar class="scrollbar">
          <n-grid
            class="all-note"
            responsive="screen"
            cols="1 s:2 m:3 l:4"
            :x-gap="10"
            :y-gap="10"
          >
            <n-grid-item
              v-for="item in noteData"
              :key="item.id"
              class="note-item"
              @contextmenu="noteContextmenu($event, item)"
              @mouseenter="handleHover(item)"
              @mouseleave="handleLeave"
            >
              <div class="note-item__content">
                <div class="note-item__header">
                  <span class="title">{{ item.title }}</span>
                  <span class="time">{{ formatTime(item.createTime) }}</span>
                </div>
                <div class="note-item__body">
                  <p class="content">{{ item.content }}</p>
                </div>
              </div>
            </n-grid-item>
            <n-grid-item
              class="note-item add-item"
              @contextmenu="(e) => e.preventDefault()"
              @click="addNoteModalOpen"
            >
              <div class="note-item__content">
                <div class="note-item__icon">
                  <SvgIcon iconName="icon-add" />
                </div>
                <span class="name">添加便签</span>
              </div>
            </n-grid-item>
          </n-grid>
        </n-scrollbar>
      </div>
      <div v-else class="not-note">
        <span class="tip">暂无便签，去添加吧</span>
        <n-button strong secondary @click="addNoteModalOpen">
          <template #icon>
            <SvgIcon iconName="icon-add" />
          </template>
          添加便签
        </n-button>
      </div>
    </Transition>
  </div>

  <!-- 添加便签 -->
  <n-modal
    preset="card"
    v-model:show="addNoteModalShow"
    :title="`${addNoteModalType ? '编辑' : '添加'}便签`"
    :bordered="false"
    @mask-click="addNoteClose"
  >
    <n-form
      ref="addNoteRef"
      :rules="addNoteRules"
      :model="addNoteValue"
      :label-width="80"
    >
      <n-form-item label="标题" path="title">
        <n-input
          clearable
          show-count
          maxlength="20"
          v-model:value="addNoteValue.title"
          placeholder="请输入便签标题"
        />
      </n-form-item>
      <n-form-item label="内容" path="content">
        <n-input
          type="textarea"
          clearable
          v-model:value="addNoteValue.content"
          placeholder="请输入便签内容"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addNoteClose"> 取消 </n-button>
        <n-button strong secondary @click="addOrEditNotes">
          {{ addNoteModalType ? "编辑" : "添加" }}
        </n-button>
      </n-space>
    </template>
  </n-modal>

  <!-- 便签右键菜单 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="large"
    :x="noteDropdownX"
    :y="noteDropdownY"
    :options="noteDropdownOptions"
    :show="noteDropdownShow"
    :on-clickoutside="() => (noteDropdownShow = false)"
    @select="noteDropdownSelect"
  />
</template>

<script setup lang="ts">
import { ref, nextTick, h } from "vue";
import {
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NDropdown,
  useMessage,
  useDialog,
  type FormRules,
  type FormInst,
  type MenuOption,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { siteStore } from "@/stores";
import SvgIcon from "@/components/SvgIcon.vue";
import type { NoteItem } from '@/stores/siteStore'

const site = siteStore();
const message = useMessage();
const dialog = useDialog();
const { noteData } = storeToRefs(site);

// 图标渲染
const renderIcon = (icon: string) => {
  return () => h(SvgIcon, { iconName: `icon-${icon}` } as any);
};

// 添加便签数据
const addNoteRef = ref<FormInst | null>(null);
const addNoteModalShow = ref(false);
const addNoteModalType = ref(false);
const addNoteValue = ref<NoteItem>({
  id: 0,
  title: "",
  content: "",
  createTime: Date.now(),
});

// 表单验证规则
const addNoteRules: FormRules = {
  title: {
    required: true,
    message: "请输入便签标题",
    trigger: ["blur", "input"],
  },
  content: {
    required: true,
    message: "请输入便签内容",
    trigger: ["blur", "input"],
  },
};

// 右键菜单数据
const noteDropdownX = ref(0);
const noteDropdownY = ref(0);
const noteDropdownShow = ref(false);
const noteDropdownOptions: MenuOption[] = [
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

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 悬停效果
const handleHover = (item: NoteItem) => {
  // 可以在这里添加悬停动画效果
};

const handleLeave = () => {
  // 可以在这里添加离开动画效果
};

// 关闭弹窗
const addNoteClose = () => {
  addNoteModalShow.value = false;
  addNoteValue.value = {
    id: 0,
    title: "",
    content: "",
    createTime: Date.now(),
  };
};

// 开启添加便签
const addNoteModalOpen = () => {
  // 生成 ID
  const noteMaxID = Math.max(...site.noteData.map(item => item.id), 0);
  // 生成表单数据
  addNoteValue.value = {
    id: noteMaxID + 1,
    title: "",
    content: "",
    createTime: Date.now(),
  };
  addNoteModalType.value = false;
  addNoteModalShow.value = true;
};

// 添加或编辑便签
const addOrEditNotes = () => {
  addNoteRef.value?.validate((errors: any) => {
    if (errors) {
      message.error("请完善便签信息");
      return false;
    }
    // 新增便签
    if (!addNoteModalType.value) {
      site.addNote(addNoteValue.value);
      message.success("便签已添加");
      addNoteClose();
      return true;
    } else {
      // 编辑便签
      site.updateNote(addNoteValue.value);
      message.success("便签已更新");
      addNoteClose();
      return true;
    }
  });
};

// 删除便签
const delNotes = (id: number) => {
  dialog.warning({
    title: "删除便签",
    content: "确定要删除这个便签吗？删除后无法恢复",
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: () => {
      site.delNote(id);
      message.success("便签已删除");
    },
  });
};

// 开启右键菜单
const noteContextmenu = (e: MouseEvent, data: NoteItem) => {
  e.preventDefault();
  noteDropdownShow.value = false;
  // 写入弹窗数据
  addNoteValue.value = { ...data };
  nextTick().then(() => {
    noteDropdownShow.value = true;
    noteDropdownX.value = e.clientX;
    noteDropdownY.value = e.clientY;
  });
};

// 右键菜单点击
const noteDropdownSelect = (key: string) => {
  noteDropdownShow.value = false;
  switch (key) {
    case "edit":
      addNoteModalType.value = true;
      addNoteModalShow.value = true;
      break;
    case "delete":
      delNotes(addNoteValue.value.id);
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.note__layout {
  position: relative;
  height: 100%;
  background: var(--main-background-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.note {
  height: 100%; 
  overflow: hidden;
}

.scrollbar {
  height: 100%;
}

.all-note {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 4px;
}

.note-item {
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    .note-item__content {
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .title {
      font-size: 15px;
      font-weight: 500;
      color: var(--main-text-color);
      transition: color 0.3s ease;
    }
    
    .time {
      font-size: 12px;
      color: var(--main-text-color-2);
      transition: color 0.3s ease;
    }
  }
  
  &__body {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    padding: 12px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    
    .content {
      font-size: 14px;
      color: var(--main-text-color-2);
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
      transition: color 0.3s ease;
    }
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
  .note-item__content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.15);
  }
  
  .note-item__icon {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    .note-item__content {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.not-note {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 