<template>
  <main-content :title="$store.state.bountium.business.name">
    <h2>Grant new shares through dilution</h2>
    <section style="max-width: 500px">
      <label>Number of shares to grant to recipient</label>
      <div>
        <a-input-number v-model="sharesToGrant" class="field" placeholder="1" />
      </div>
      <label>Ethereum address of recipient</label>
      <a-input
        v-model="recipientAddress"
        class="field"
        placeholder="0x5fa32e..."
        @keyup.enter="grantShares"
      />
      <a-button type="primary" @click="grantShares">
        Grant shares
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
      if (!store.state.bountium.business.privileges.canDilute) {
        return redirect(302, `/business/${route.params.contract}`)
      }
    }
  ],
  data() {
    return {
      recipientAddress: '',
      sharesToGrant: ''
    }
  },
  methods: {
    async grantShares() {
      try {
        const task = () =>
          this.$store.state.bountium.business.contract.functions.dilute(
            this.sharesToGrant,
            this.recipientAddress
          )

        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Granting new shares',
          task
        })

        this.$notification.success({
          message: 'Successfully granted new shares'
        })

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to grant new shares'
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
