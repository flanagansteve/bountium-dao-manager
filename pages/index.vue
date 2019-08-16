<template>
  <main>
    <island class="container">
      <h1 class="h1">Welcome to Bountium!</h1>
      <h2 class="h2">Manage your business</h2>
      <section class="cta">
        <nuxt-link to="business/create">
          <a-button size="large" type="primary">
            <a-icon type="plus-circle" />Deploy Business
          </a-button>
        </nuxt-link>
        <nuxt-link to="/business/lookup">
          <a-button size="large" type="primary" class="cta__lookup-button">
            <a-icon type="search" />Lookup Business
          </a-button>
        </nuxt-link>
      </section>
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

.h2 {
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 20pt;
  color: rgb(120, 120, 120);
}

.cta {
  margin: 40px auto;

  &__lookup-button {
    margin: 0 0 0 30px;
  }
}
</style>
