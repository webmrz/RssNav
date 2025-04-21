<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" tab="捷径">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane class="height--full no-padding" name="note" tab="便签">
      <Note />
    </n-tab-pane>
    <n-tab-pane class="height--full no-padding" name="todo" tab="待办">
      <Todo />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from "naive-ui";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";
import Note from "@/components/AllFunc/Box/Note.vue";
import Todo from "@/components/AllFunc/Box/Todo.vue";
</script>

<style lang="scss" scoped>
.height--full {
  height: 100%;
}

.padding--box {
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--main-background-light-color);
  border-radius: 8px;
  margin: 0 20px;
  box-shadow: var(--main-box-shadow);
}
</style>