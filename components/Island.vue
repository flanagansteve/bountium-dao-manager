<template>
  <a-layout-content class="content">
    <main class="content--island">
      <slot />
    </main>
  </a-layout-content>
</template>

<style lang="less" scoped>
.content {
  background: white;
  margin: 24px;

  &--island {
    padding: 24px;
  }
}
</style>
