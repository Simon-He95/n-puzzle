<script setup lang="ts">
const slots = useSlots();
let content = slots.default()[0].children;
const types = $ref("");
const { interval = 20 } = useAttrs();
function updateContext(content, t) {
  return dfs(content);
  function dfs(content) {
    if (content[0] === "\\" && content[1] === "n") {
      types += " \n ";
      content = content.slice(2);
      return dfs();
    }
    types += content[0];
    content = content.slice(1);
    if (content.length !== 0) {
      setTimeout(() => dfs(content), t);
    }
  }
}
updateContext(content, interval);
</script>

<template>
  <div whitespace-pre-line>{{ types }}</div>
</template>

<style scoped></style>
