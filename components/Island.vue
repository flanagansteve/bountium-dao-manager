<template>
  <a-layout-content class="content">
    <main class="content__island">
      <slot />
    </main>
  </a-layout-content>
</template>

<style lang="less" scoped>
.content {
  background: white;
  margin: 24px;

  &__island {
    padding: 24px;
  }
}
</style>
