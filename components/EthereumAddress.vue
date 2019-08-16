<template>
  <a-tooltip>
    <template slot="title">
      View account on Etherscan
    </template>
    <a class="address" :href="etherscanAccount" target="__blank">{{
      parsedAddress
    }}</a>
  </a-tooltip>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      required: true
    },
    concat: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    parsedAddress() {
      return this.concat
        ? `${this.address.slice(0, 6)}...${this.address.slice(-4)}`
        : this.address
    },
    etherscanAccount() {
      const baseUrl = this.$store.getters['bountium/etherscanUrl']
      return `${baseUrl}address/${this.address}`
    }
  }
}
</script>

<style lang="less" scoped>
.address {
  font-family: Inconsolata;
  font-size: 12pt;

  &:hover {
    text-decoration: underline;
  }
}
</style>
