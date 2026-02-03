<script setup lang="ts">
import { baseImage } from './request'

baseImage()
</script>

<template>
  <main font-sans min-h-screen p-b-10 text="center gray-900 dark:gray-100">
    <Puzzle />
    <Footer />
  </main>
</template>

<style scoped></style>
