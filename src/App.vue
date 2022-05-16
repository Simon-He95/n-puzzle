<script setup lang="ts">
import { getImage } from "./request";
getImage();
</script>

<style scoped></style>
<template>
  <main font-sans p-b-10 text="center gray-700 dark:gray-200">
    <Puzzle />
    <Footer />
  </main>
</template>
