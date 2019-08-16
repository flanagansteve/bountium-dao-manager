<template>
  <main>
    <island class="container">
      <h1 class="h1">Install MetaMask</h1>
      <h3 class="h3">
        To get started with Bountium, install an Ethereum wallet to securely
        interact with Dapps.
      </h3>
      <a href="https://metamask.io/" target="_blank">
        <img
          class="metamask-button"
          src="https://user-images.githubusercontent.com/35871990/52589566-1dbeb200-2e0d-11e9-8dfe-f9aebfcedb2d.png"
        />
      </a>
      <h3>
        After MetaMask is installed,
        <nuxt-link to="/">continue with Bountium</nuxt-link>.
      </h3>
    </island>
  </main>
</template>

<script>
import Island from '@/components/Island.vue'

export default {
  components: {
    Island
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: center;
}

.h1 {
  font-size: 28pt;
}

.h3 {
  text-align: left;
}

.metamask-button {
  margin: 20px 0 26px 0;
  height: 60px;
}
</style>
