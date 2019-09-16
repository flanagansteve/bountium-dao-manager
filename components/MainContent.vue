<template>
  <main>
    <a-layout-header class="header">
      <section class="header__content">
        <h1 class="header__content__title">
          {{ title }}
        </h1>
        <a v-if="storefrontUrl" :href="storefrontUrl" target="_blank">
          <a-button type="primary"
            ><a-icon type="shopping" />View storefront</a-button
          >
        </a>
        <div class="spacer" />
        <div v-if="$store.state.bountium.account" class="metamask">
          <div class="metamask__indicator"></div>
          <ethereum-address
            class="metamask__address"
            :address="$store.state.bountium.account.ethereumAddress"
            :concat="true"
          />
          <div class="metamask__network">{{ ethereumNetwork }}</div>
        </div>
      </section>
    </a-layout-header>
    <island>
      <slot />
    </island>
  </main>
</template>

<script>
import Island from './Island.vue'
import EthereumAddress from './EthereumAddress.vue'

export default {
  components: {
    Island,
    EthereumAddress
  },
  props: {
    title: {
      required: true,
      type: String
    }
  },
  computed: {
    ethereumNetwork() {
      return this.$store.state.bountium.account.chainId === 1
        ? 'Mainnet'
        : this.$store.state.bountium.account.chainId === 3
        ? 'Ropsten'
        : this.$store.state.bountium.account.chainId === 42
        ? 'Kovan'
        : 'Unknown'
    },
    etherscanAccount() {
      const baseUrl = this.$store.getters['bountium/etherscanUrl']
      const ethereumAddress = this.$store.state.bountium.account.ethereumAddress
      return `${baseUrl}address/${ethereumAddress}`
    },
    storefrontUrl() {
      const contract = this.$store.state.bountium.business.contract
      return contract ? `https://shop.bountium.org/?${contract.address}` : null
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  background: white;
  display: flex;
  flex-flow: row nowrap;

  &__content {
    flex: 1 0;
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 2px solid rgb(62, 135, 247);

    &__title {
      height: 100%;
      margin: 0 20px 0 0;
    }
  }
}

.spacer {
  flex: 1 0;
}

.metamask {
  align-self: center;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  &__indicator {
    border-radius: 50%;
    height: 14px;
    width: 14px;
    margin: 0 12px 0 0;
    background: limegreen;
  }

  &__address {
    margin: 0 16px 0 0;
    color: rgb(120, 120, 120);
  }

  &__network {
    height: 28px;
    padding: 2px 10px;
    border: 2px solid rgb(62, 135, 247);
    border-radius: 14px;
    background: white;
    color: rgb(62, 135, 247);
    line-height: 20px;
    user-select: none;
  }
}
</style>
