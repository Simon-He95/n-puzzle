<script setup lang="ts">
import { baseImage } from './request'

baseImage()
</script>

<template>
  <main font-sans p-b-5 text="center gray-700 dark:gray-200">
    <Puzzle />
    <Footer />
  </main>
</template>

<style scoped></style>
