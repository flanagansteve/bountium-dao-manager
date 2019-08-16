<template>
  <main-content :title="$store.state.bountium.business.name">
    <section v-if="totalShares">
      <h2>Transfer shares</h2>
      <section style="max-width: 500px">
        <!-- TODO Add more advanced logic to check the number of shares that can actually be transferred! -->
        <a-input
          v-model="sharesToTransfer"
          class="input"
          type="number"
          :placeholder="
            `Number of shares to transfer (min: 1, max: ${totalShares})`
          "
        />
        <a-input
          v-model="recipientAddress"
          class="input"
          placeholder="Ethereum address of recipient"
          @keyup.enter="createBusiness"
        />
        <a-button type="primary" @click="transferShares">
          Transfer
        </a-button>
      </section>
    </section>
    <a-spin v-else size="large" />
  </main-content>
</template>

<script>
import MainContent from '@/components/MainContent.vue'

export default {
  components: {
    MainContent
  },
  middleware: ['construction', 'metamask', 'business'],
  data() {
    return {
      recipientAddress: '',
      sharesToTransfer: '',
      totalShares: null
    }
  },
  async created() {
    this.totalShares = await this.$store.state.bountium.business.contract.functions.totalShares()
  },
  methods: {
    async transferShares() {
      let txHash
      try {
        const tx = await this.$store.state.bountium.business.contract.functions.transferShares(
          this.sharesToTransfer,
          this.recipientAddress
        )

        txHash = tx.hash
        const txLink = `${
          this.$store.getters['bountium/etherscanUrl']
        }tx/${txHash}`

        this.$notification.open({
          key: txHash,
          message: `Transferring shares`,
          description: () => (
            <a href={txLink} target="_blank">
              View in explorer
            </a>
          ),
          icon: () => <a-spin />,
          duration: 0,
          placement: 'bottomRight'
        })

        // Wait 1 confirmation
        const receipt = await tx.wait(1)
        /**
         * Per EIP 658, a receipt of 1 indicates the tx was successful:
         * https://github.com/Arachnid/EIPs/blob/d1ae915d079293480bd6abb0187976c230d57903/EIPS/eip-658.md
         */
        if (receipt.status !== 1) {
          throw new Error('Ethereum transaction reverted by the EVM')
        }

        this.$notification.close(txHash)
        this.$notification.success({
          message: 'Successfully transferred shares',
          placement: 'bottomRight'
        })

        // Auto redirect to new business page
        this.$router.push({
          path: `/business/${this.$store.state.bountium.business.contract.address}`
        })
      } catch (err) {
        console.error('Failed to transfer shares:', err)

        this.$notification.close(txHash)
        this.$notification.error({
          message: 'Failed to transfer shares',
          placement: 'bottomRight'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input {
  margin: 0 0 20px 0;
}
</style>
