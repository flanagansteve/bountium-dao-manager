<template>
  <a-layout class="container">
    <a-layout-sider width="240">
      <section class="header">
        <img class="header__logo" src="/bountium-logo.png" />
        <span class="header__tagline">Bountium<br />Admin</span>
      </section>
      <!-- Refer to https://nuxtjs.org/guide/routing/#dynamic-routes for details about how routes are named -->
      <a-menu theme="dark" mode="inline" :selected-keys="[$route.name]">
        <a-menu-item key="index">
          <nuxt-link to="/">
            <a-icon type="home" theme="outlined" />
            <span>Home</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="business-create" class="menu--level-2">
          <nuxt-link to="/business/create">
            <a-icon type="plus-circle" theme="outlined" />
            <span>Create Business</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="business-lookup" class="menu--level-2">
          <nuxt-link to="/business/lookup">
            <a-icon type="search" theme="outlined" />
            <span>Lookup Business</span>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
      <a-menu
        v-if="$store.state.bountium.business.contract"
        theme="dark"
        mode="inline"
        :selected-keys="[$route.name]"
      >
        <a-menu-item key="business-contract">
          <nuxt-link :to="businessBaseUrl">
            <a-icon type="shop" theme="outlined" />
            <span>My Business</span>
          </nuxt-link>
        </a-menu-item>
        <!-- TODO This should only be allowed if the user has a catalog privilege -->
        <a-menu-item key="business-contract-products-new" class="menu--level-2">
          <nuxt-link :to="`${businessBaseUrl}/products/new`">
            <a-icon type="plus-circle" theme="outlined" />
            <span>New Product</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="business-contract-products" class="menu--level-2">
          <nuxt-link :to="`${businessBaseUrl}/products`">
            <a-icon type="shopping-cart" theme="outlined" />
            <span>Products</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="business-contract-orders" class="menu--level-2">
          <nuxt-link :to="`${businessBaseUrl}/orders`">
            <a-icon type="solution" theme="outlined" />
            <span>Orders</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          v-if="$store.state.bountium.business.privileges.stake.gt(0)"
          key="business-contract-transfer"
          class="menu--level-2"
        >
          <nuxt-link :to="`${businessBaseUrl}/transfer`">
            <a-icon type="swap" theme="outlined" />
            <span>Transfer</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          v-if="$store.state.bountium.business.privileges.canDilute"
          key="business-contract-dilute"
          class="menu--level-2"
        >
          <nuxt-link :to="`${businessBaseUrl}/dilute`">
            <a-icon type="pie-chart" theme="outlined" />
            <span>Dilute</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          v-if="$store.state.bountium.business.privileges.canBestow"
          key="business-contract-privileges"
          class="menu--level-2"
        >
          <nuxt-link :to="`${businessBaseUrl}/privileges`">
            <a-icon type="team" theme="outlined" />
            <span>Privileges</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          v-if="$store.state.bountium.business.privileges.callsDividend"
          key="business-contract-dividend"
          class="menu--level-2"
        >
          <nuxt-link :to="`${businessBaseUrl}/dividend`">
            <a-icon type="stock" theme="outlined" />
            <span>Dividends</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="business-contract-fund" class="menu--level-2">
          <nuxt-link :to="`${businessBaseUrl}/fund`">
            <a-icon type="login" theme="outlined" />
            <span>Fund</span>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <pending-transaction />
      <nuxt />
    </a-layout>
  </a-layout>
</template>

<script>
import PendingTransaction from '@/components/PendingTransaction.vue'

export default {
  components: {
    PendingTransaction
  },
  computed: {
    businessBaseUrl() {
      return `/business/${this.$store.state.bountium.business.contract.address}`
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  min-height: 100vh;
}

.menu--level-2 {
  padding: 0 0 0 40px !important;
}

.menu--level-3 {
  padding: 0 0 0 80px !important;
}

.header {
  display: flex;
  flex-flow: column nowrap;

  &__logo {
    height: 60px;
    margin: 20px auto 24px auto;
  }

  &__tagline {
    margin: 0 0 16px 0;
    text-align: center;
    font-size: 14pt;
    color: lightgray;
    font-family: 'Montserrat';
  }
}
</style>
