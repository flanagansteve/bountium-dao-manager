<template>
  <main-content :title="$store.state.bountium.business.name">
    <h2>Transfer shares</h2>
    <section style="max-width: 500px">
      <label
        >Number of shares to transfer (up to
        {{ $store.state.bountium.business.privileges.stake }})</label
      >
      <div>
        <a-input-number
          v-model="sharesToTransfer"
          class="field"
          placeholder="1"
        />
      </div>
      <label>Ethereum address of recipient</label>
      <a-input
        v-model="recipientAddress"
        class="field"
        placeholder="0x5fa32e..."
        @keyup.enter="transferShares"
      />
      <a-button type="primary" @click="transferShares">
        Transfer
      </a-button>
    </section>
  </main-content>
</template>

<script>
import MainContent from '@/components/MainContent.vue'

export default {
  components: {
    MainContent
  },
  middleware: [
    'metamask',
    'business',
    ({ store, redirect, route }) => {
      if (!store.state.bountium.business.privileges.stake.gt(0)) {
        return redirect(302, `/business/${route.params.contract}`)
      }
    }
  ],
  data() {
    return {
      recipientAddress: '',
      sharesToTransfer: ''
    }
  },
  methods: {
    async transferShares() {
      try {
        const transferShares = this.$store.state.bountium.business.contract
          .functions.transferShares

        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Transferring shares',
          task: () =>
            transferShares(this.sharesToTransfer, this.recipientAddress)
        })

        this.$notification.success({
          message: 'Successfully transferred shares'
        })

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to transfer shares'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.field {
  margin: 5px 0 15px 0;
}
</style>
