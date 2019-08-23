<template>
  <main-content :title="$store.state.bountium.business.name">
    <h2>Fund business</h2>
    <section style="max-width: 500px">
      <label>Amount in ETH</label>
      <!-- TODO Abstract this out into an "amount" component -->
      <div>
        <!-- TODO Move "styles" to actual styles -->
        <a-input-number
          v-model="amountToFund"
          class="field"
          style="width: 200px"
          placeholder="0.12"
        />
        <span v-if="amountUsd" style="margin-left: 10px">${{ amountUsd }}</span>
      </div>
      <a-button type="primary" @click="fundBusiness">
        Fund
      </a-button>
    </section>
  </main-content>
</template>

<script>
// import { parseEther } from '@ethersproject/units'
import MainContent from '@/components/MainContent.vue'

export default {
  components: {
    MainContent
  },
  middleware: ['metamask', 'business'],
  data() {
    return {
      amountToFund: null
    }
  },
  computed: {
    amountUsd() {
      const rate = this.$store.state.bountium.exchangeRate
      const amount =
        !rate || !this.amountToFund ? null : this.amountToFund * rate

      // Allows prevents against NaN errors
      return amount > 0 ? amount.toFixed(2) : null
    }
  },
  methods: {
    async fundBusiness() {
      try {
        const task = () =>
          this.$store.state.bountium.account
            .ethersProvider()
            .getSigner()
            .sendTransaction({
              // to: this.$store.state.bountium.business.contract.address,
              // value: parseEther(this.amountToFund.toString())
              to: '0x3f1B9CC9636E2b5c4b37C3c9eDfe9eBd16333F69',
              value: '0x1'
            })

        debugger

        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Funding business',
          task
        })

        this.$notification.success({
          message: 'Successfully funded business'
        })

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to fund business'
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
