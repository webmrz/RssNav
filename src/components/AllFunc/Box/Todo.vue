<template>
  <div class="todo__layout">
    <Transition name="fade" mode="out-in">
      <div v-if="todoData[0]" class="todo">
        <n-scrollbar class="scrollbar">
          <n-grid
            class="all-todo"
            responsive="screen"
            cols="1 s:2 m:3 l:4"
            :x-gap="10"
            :y-gap="10"
          >
            <n-grid-item
              v-for="item in todoData"
              :key="item.id"
              class="todo-item"
              @contextmenu="todoContextmenu($event, item)"
              @mouseenter="handleHover(item)"
              @mouseleave="handleLeave"
            >
              <div class="todo-item__content">
                <div class="todo-item__header">
                  <n-checkbox
                    :checked="item.completed"
                    @update:checked="toggleTodo(item)"
                  />
                  <span class="title" :class="{ completed: item.completed }">{{ item.title }}</span>
                </div>
                <div class="todo-item__body">
                  <p class="content">{{ item.content }}</p>
                  <span class="time">{{ formatTime(item.createTime) }}</span>
                </div>
              </div>
            </n-grid-item>
            <n-grid-item
              class="todo-item add-item"
              @contextmenu="(e) => e.preventDefault()"
              @click="addTodoModalOpen"
            >
              <div class="todo-item__content">
                <div class="todo-item__icon">
                  <SvgIcon iconName="icon-add" />
                </div>
                <span class="name">添加待办</span>
              </div>
            </n-grid-item>
          </n-grid>
        </n-scrollbar>
      </div>
      <div v-else class="not-todo">
        <span class="tip">暂无待办，去添加吧</span>
        <n-button strong secondary @click="addTodoModalOpen">
          <template #icon>
            <SvgIcon iconName="icon-add" />
          </template>
          添加待办
        </n-button>
      </div>
    </Transition>
  </div>

  <!-- 添加待办 -->
  <n-modal
    preset="card"
    v-model:show="addTodoModal"
    :title="`${addTodoModalType ? '编辑' : '添加'}待办`"
    :bordered="false"
    @mask-click="addTodoClose"
  >
    <n-form
      ref="todoFormRef"
      :rules="formRules"
      :model="todoForm"
      :label-width="80"
    >
      <n-form-item label="标题" path="title">
        <n-input
          clearable
          show-count
          maxlength="20"
          v-model:value="todoForm.title"
          placeholder="请输入待办标题"
        />
      </n-form-item>
      <n-form-item label="内容" path="content">
        <n-input
          type="textarea"
          clearable
          v-model:value="todoForm.content"
          placeholder="请输入待办内容"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addTodoClose"> 取消 </n-button>
        <n-button strong secondary @click="addOrEditTodo">
          {{ addTodoModalType ? "编辑" : "添加" }}
        </n-button>
      </n-space>
    </template>
  </n-modal>

  <!-- 待办右键菜单 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="large"
    :x="todoDropdownX"
    :y="todoDropdownY"
    :options="todoDropdownOptions"
    :show="todoDropdownShow"
    :on-clickoutside="() => (todoDropdownShow = false)"
    @select="(key: string, option: MenuOption) => handleDropdownSelect(key, option)"
  />
</template>

<script setup lang="ts">
import { ref, nextTick, h, computed } from "vue";
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
  NCheckbox,
  useMessage,
  useDialog,
  type FormRules,
  type FormInst,
  type MenuOption,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { siteStore } from "@/stores";
import SvgIcon from "@/components/SvgIcon.vue";
import type { TodoItem } from '@/stores/siteStore'

const site = siteStore();
const message = useMessage();
const dialog = useDialog();
const { todoData } = storeToRefs(site);

const todoDataComputed = computed(() => site.todoData);

// 图标渲染
const renderIcon = (icon: string) => {
  return () => h(SvgIcon, { iconName: `icon-${icon}` } as any);
};

// 添加待办数据
const todoFormRef = ref<FormInst | null>(null);
const addTodoModal = ref(false);
const addTodoModalType = ref(false);
const todoForm = ref<{
  id: number
  title: string
  content: string
  completed: boolean
  createTime: number
}>({
  id: 0,
  title: '',
  content: '',
  completed: false,
  createTime: Date.now()
});

// 表单验证规则
const formRules: FormRules = {
  title: {
    required: true,
    message: "请输入待办标题",
    trigger: ["blur", "input"],
  },
  content: {
    required: true,
    message: "请输入待办内容",
    trigger: ["blur", "input"],
  },
};

// 右键菜单数据
const todoDropdownX = ref(0);
const todoDropdownY = ref(0);
const todoDropdownShow = ref(false);
const todoDropdownOptions = [
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
const handleHover = (item: TodoItem) => {
  // 可以在这里添加悬停动画效果
};

const handleLeave = () => {
  // 可以在这里添加离开动画效果
};

// 切换待办状态
const toggleTodo = (item: TodoItem) => {
  site.updateTodo({
    ...item,
    completed: !item.completed
  });
  message.success(item.completed ? "待办已标记为未完成" : "待办已标记为已完成");
};

// 关闭弹窗
const addTodoClose = () => {
  addTodoModal.value = false;
  todoForm.value = {
    id: 0,
    title: '',
    content: '',
    completed: false,
    createTime: Date.now()
  };
};

// 开启添加待办
const addTodoModalOpen = () => {
  // 生成 ID
  const todoMaxID = Math.max(...site.todoData.map(item => item.id), 0);
  // 生成表单数据
  todoForm.value = {
    id: todoMaxID + 1,
    title: "",
    content: "",
    completed: false,
    createTime: Date.now(),
  };
  addTodoModalType.value = false;
  addTodoModal.value = true;
};

// 添加或编辑待办
const addOrEditTodo = () => {
  todoFormRef.value?.validate((errors: any) => {
    if (errors) {
      message.error("请完善待办信息");
      return false;
    }
    // 新增待办
    if (!addTodoModalType.value) {
      site.addTodo(todoForm.value);
      message.success("待办已添加");
      addTodoClose();
      return true;
    } else {
      // 编辑待办
      site.updateTodo(todoForm.value);
      message.success("待办已更新");
      addTodoClose();
      return true;
    }
  });
};

// 删除待办
const delTodo = (id: number) => {
  dialog.warning({
    title: "删除待办",
    content: "确定要删除这个待办吗？删除后无法恢复",
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: () => {
      site.delTodo(id);
      message.success("待办已删除");
    },
  });
};

// 右键菜单处理
const todoContextmenu = (e: MouseEvent, item: TodoItem) => {
  e.preventDefault();
  todoDropdownX.value = e.clientX;
  todoDropdownY.value = e.clientY;
  todoDropdownShow.value = true;
  todoForm.value = { ...item };
};

// 右键菜单选择
const handleDropdownSelect = (key: string, option: MenuOption) => {
  todoDropdownShow.value = false;
  switch (key) {
    case "edit":
      addTodoModalType.value = true;
      addTodoModal.value = true;
      break;
    case "delete":
      delTodo(todoForm.value.id);
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.todo__layout {
  position: relative;
  height: 100%;
  background: var(--main-background-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.todo {
  height: 100%;
  padding: 20px;
  overflow: hidden;
}

.scrollbar {
  height: 100%;
}

.all-todo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 4px;
}

.todo-item {
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    .todo-item__content {
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  &__content {
    display: flex;
    align-items: center;
    padding: 8px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    :deep(.n-checkbox) {
      margin-right: 0;
    }
    
    .title {
      font-size: 15px;
      font-weight: 500;
      color: var(--main-text-color);
      transition: all 0.3s ease;
      
      &.completed {
        text-decoration: line-through;
        color: var(--main-text-color-2);
      }
    }
  }
  
  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.05);
    padding: 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    .content {
      font-size: 14px;
      color: var(--main-text-color-2);
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
      transition: color 0.3s ease;
    }
    
    .time {
      font-size: 12px;
      color: var(--main-text-color-2);
      margin-top: 8px;
      transition: color 0.3s ease;
    }
  }
}

.add-item {
  .todo-item__content {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.15);
  }
  
  .todo-item__icon {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    .todo-item__content {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  .name {
    font-size: 13px;
    color: var(--main-text-color);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.not-todo {
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