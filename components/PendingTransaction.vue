<template>
  <a-modal
    :visible="!!transaction"
    :closable="false"
    :mask-closable="false"
    :footer="null"
  >
    <h2>
      <a-spin />&ensp;<span>{{
        transaction && transaction.pendingMessage
      }}</span>
    </h2>
    <a v-if="txLink" :href="txLink" target="_blank">
      View on Etherscan
    </a>
  </a-modal>
</template>

<script>
export default {
  computed: {
    transaction() {
      return this.$store.state.bountium.transaction
    },
    txLink() {
      return this.transaction && this.transaction.txHash
        ? `${this.$store.getters['bountium/etherscanUrl']}tx/${
            this.transaction.txHash
          }`
        : null
    }
  }
}
</script>
