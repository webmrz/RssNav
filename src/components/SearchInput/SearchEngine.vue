<template>
  <Transition name="fadeDown" mode="out-in">
    <div v-if="status.engineChangeStatus" class="engine-choose">
      <n-scrollbar style="max-height: 44.5vh">
        <div
          ref="engineListContainer"
          class="all-engine"
        >
          <div
            v-for="(item, key) in engineList"
            :key="key"
            :class="['engine-item', key === set.searchEngine ? 'choose' : null]"
            :data-key="key"
          >
            <div class="drag-handle">
              <SvgIcon iconName="icon-drag" />
            </div>
            <div class="engine-content" @click="changeSearchEngine(key)">
              <SvgIcon :iconName="`icon-${key}`" />
              <span class="name">{{ item.name }}</span>
            </div>
            <div class="engine-actions">
              <n-button
                circle
                size="small"
                @click="editEngine(key, item)"
                v-if="key !== 'custom'"
              >
                <template #icon>
                  <SvgIcon iconName="icon-edit" />
                </template>
              </n-button>
              <n-button
                circle
                size="small"
                @click="deleteEngine(key)"
                v-if="key !== 'custom' && Object.keys(engineList).length > 1"
              >
                <template #icon>
                  <SvgIcon iconName="icon-delete" />
                </template>
              </n-button>
            </div>
          </div>
        </div>
        <div class="engine-actions-group">
          <n-button
            strong
            secondary
            @click="addEngineModal = true"
          >
            添加搜索引擎
          </n-button>
          <n-button
            strong
            secondary
            @click="customEngineModal = true"
          >
            自定义配置
          </n-button>
        </div>
      </n-scrollbar>

      <!-- 添加/编辑搜索引擎 -->
      <n-modal
        preset="card"
        :title="isEditing ? '编辑搜索引擎' : '添加搜索引擎'"
        v-model:show="addEngineModal"
        :bordered="false"
      >
        <n-form
          ref="engineFormRef"
          :rules="engineFormRules"
          :model="engineFormValue"
          :label-width="80"
        >
          <n-form-item label="名称" path="name">
            <n-input
              v-model:value="engineFormValue.name"
              placeholder="请输入搜索引擎名称"
            />
          </n-form-item>
          <n-form-item label="标识" path="key" v-if="!isEditing">
            <n-input
              v-model:value="engineFormValue.key"
              placeholder="请输入唯一标识（英文）"
            />
          </n-form-item>
          <n-form-item label="图标" path="icon">
            <n-input
              v-model:value="engineFormValue.icon"
              placeholder="请输入图标名称"
            />
          </n-form-item>
          <n-form-item label="搜索URL" path="url">
            <n-input
              v-model:value="engineFormValue.url"
              placeholder="请输入搜索URL，使用 %s 作为搜索词占位符"
            />
          </n-form-item>
          <n-form-item label="翻译URL" path="translation">
            <n-input
              v-model:value="engineFormValue.translation"
              placeholder="请输入翻译URL（可选）"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button strong secondary @click="addEngineModal = false">
              取消
            </n-button>
            <n-button strong secondary type="primary" @click="submitEngineForm">
              确认
            </n-button>
          </n-space>
        </template>
      </n-modal>

      <!-- 自定义搜索引擎 -->
      <n-modal
        preset="card"
        title="自定义搜索引擎"
        v-model:show="customEngineModal"
        :bordered="false"
      >
        <n-form
          ref="customEngineRef"
          :rules="customEngineRules"
          :model="customEngineValue"
          :label-width="80"
        >
          <n-form-item label="搜索URL" path="url">
            <n-input
              clearable
              v-model:value="customEngineValue.url"
              placeholder="请输入自定义搜索引擎地址"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button strong secondary @click="customEngineModal = false">
              取消
            </n-button>
            <n-button strong secondary type="primary" @click="setCustomEngine">
              确认
            </n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  NSpace,
  NButton,
  NScrollbar,
  NModal,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from "naive-ui";
import { statusStore, setStore } from "@/stores";
import defaultEngine from "@/assets/defaultEngine.json";
import Sortable from 'sortablejs';

const set = setStore();
const status = statusStore();
const message = useMessage();

// 搜索引擎列表
const engineList = ref({ ...defaultEngine });
const engineListContainer = ref(null);

// 自定义搜索引擎数据
const customEngineRef = ref(null);
const customEngineModal = ref(false);
const customEngineValue = ref({
  url: set.customEngineUrl,
});

// 添加/编辑搜索引擎
const engineFormRef = ref(null);
const addEngineModal = ref(false);
const isEditing = ref(false);
const editingKey = ref('');
const engineFormValue = ref({
  name: '',
  key: '',
  icon: '',
  url: '',
  translation: '',
});

// 表单验证规则
const engineFormRules = {
  name: {
    required: true,
    message: '请输入搜索引擎名称',
    trigger: ['blur', 'input'],
  },
  key: {
    required: true,
    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
    message: '标识必须以字母开头，只能包含字母、数字和下划线',
    trigger: ['blur', 'input'],
  },
  icon: {
    required: true,
    message: '请输入图标名称',
    trigger: ['blur', 'input'],
  },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请输入搜索URL');
      } else if (!value.includes('%s')) {
        return new Error('URL必须包含 %s 作为搜索词占位符');
      }
      return true;
    },
    trigger: ['blur', 'input'],
  },
};

const customEngineRules = {
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("请输入自定义搜索引擎地址");
      } else if (!/^https:\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(value)) {
        return new Error("请检查是否为网址且是否为 https:// 开头");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};

// 处理拖拽结束
const handleDragEnd = () => {
  // 保存新的排序到本地存储
  localStorage.setItem('engineOrder', JSON.stringify(Object.keys(engineList.value)));
  message.success('排序已保存');
};

// 更换搜索引擎
const changeSearchEngine = (key) => {
  const mainInput = document.getElementById("main-input");
  set.setSearchEngine(key);
  status.setEngineChangeStatus(false);
  mainInput?.focus();
};

// 编辑搜索引擎
const editEngine = (key, engine) => {
  isEditing.value = true;
  editingKey.value = key;
  engineFormValue.value = {
    name: engine.name,
    icon: engine.icon,
    url: engine.url,
    translation: engine.translation || '',
  };
  addEngineModal.value = true;
};

// 删除搜索引擎
const deleteEngine = (key) => {
  if (key === set.searchEngine) {
    message.error('不能删除当前使用的搜索引擎');
    return;
  }
  delete engineList.value[key];
  localStorage.setItem('engineList', JSON.stringify(engineList.value));
  message.success('删除成功');
};

// 提交搜索引擎表单
const submitEngineForm = () => {
  engineFormRef.value?.validate((errors) => {
    if (!errors) {
      if (isEditing.value) {
        // 更新现有搜索引擎
        engineList.value[editingKey.value] = {
          name: engineFormValue.value.name,
          icon: engineFormValue.value.icon,
          url: engineFormValue.value.url,
          translation: engineFormValue.value.translation,
        };
      } else {
        // 添加新搜索引擎
        const key = engineFormValue.value.key;
        if (engineList.value[key]) {
          message.error('标识已存在');
          return;
        }
        engineList.value[key] = {
          name: engineFormValue.value.name,
          icon: engineFormValue.value.icon,
          url: engineFormValue.value.url,
          translation: engineFormValue.value.translation,
        };
      }
      localStorage.setItem('engineList', JSON.stringify(engineList.value));
      addEngineModal.value = false;
      message.success(isEditing.value ? '更新成功' : '添加成功');
      // 重置表单
      engineFormValue.value = {
        name: '',
        key: '',
        icon: '',
        url: '',
        translation: '',
      };
      isEditing.value = false;
      editingKey.value = '';
    }
  });
};

// 自定义搜索引擎
const setCustomEngine = () => {
  customEngineRef.value?.validate((errors) => {
    if (!errors) {
      set.setSearchEngine(customEngineValue.value.url, true);
      customEngineModal.value = false;
      message.success("已启用自定义搜索引擎");
    } else {
      message.error("请检查您的输入");
    }
  });
};

// 初始化时从本地存储加载搜索引擎列表和排序
onMounted(() => {
  const savedEngineList = localStorage.getItem('engineList');
  if (savedEngineList) {
    engineList.value = JSON.parse(savedEngineList);
  }

  const savedOrder = localStorage.getItem('engineOrder');
  if (savedOrder) {
    const order = JSON.parse(savedOrder);
    const orderedList = {};
    order.forEach(key => {
      if (engineList.value[key]) {
        orderedList[key] = engineList.value[key];
      }
    });
    // 添加可能不在排序中的引擎
    Object.keys(engineList.value).forEach(key => {
      if (!orderedList[key]) {
        orderedList[key] = engineList.value[key];
      }
    });
    engineList.value = orderedList;
  }

  // 初始化可拖拽功能
  if (engineListContainer.value) {
    new Sortable(engineListContainer.value, {
      handle: '.drag-handle',
      animation: 300,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        if (oldIndex !== newIndex) {
          const keys = Object.keys(engineList.value);
          const [removed] = keys.splice(oldIndex, 1);
          keys.splice(newIndex, 0, removed);
          const newOrder = {};
          keys.forEach(key => {
            newOrder[key] = engineList.value[key];
          });
          engineList.value = newOrder;
          localStorage.setItem('engineOrder', JSON.stringify(keys));
          message.success('排序已保存');
        }
      },
    });
  }
});
</script>

<style lang="scss" scoped>
.engine-choose {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  color: var(--main-text-color);
  background-color: var(--main-background-light-color);
  backdrop-filter: blur(30px) saturate(1.25);
  border-radius: 16px;
  box-sizing: border-box;
  z-index: 1;

  .all-engine {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;

    .engine-item {
      display: flex;
      align-items: center;
      background-color: var(--main-background-light-color);
      border-radius: 10px;
      padding: 8px;
      transition: all 0.3s ease;

      &.choose {
        background-color: var(--main-background-hover-color);
        box-shadow: 0 0 0 2px var(--main-background-hover-color);
      }

      &:hover {
        background-color: var(--main-background-hover-color);
      }

      .drag-handle {
        cursor: move;
        padding: 0 8px;
        opacity: 0.6;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }
      }

      .engine-content {
        flex: 1;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 8px;

        .i-icon {
          margin-right: 8px;
        }

        .name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .engine-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.3s;

        .n-button {
          background-color: var(--main-background-color);

          &:hover {
            background-color: var(--main-background-hover-color);
          }
        }
      }

      &:hover .engine-actions {
        opacity: 1;
      }
    }
  }

  .engine-actions-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    border-top: 1px solid var(--main-border-color);
  }
}

// 拖拽时的样式
.sortable-ghost {
  opacity: 0.5;
  background-color: var(--main-background-hover-color) !important;
}

.sortable-drag {
  opacity: 0.9;
  background-color: var(--main-background-color) !important;
}
</style>
