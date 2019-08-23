<template>
  <main-content :title="$store.state.bountium.business.name">
    <section v-if="contractBalance !== null" style="max-width: 500px">
      <h2>Pay out dividends</h2>
      <label>Total dividend among all stakeholders, in ETH</label>
      <p style="font-size: 9pt; margin: 0">
        Maximum of {{ contractBalance }} ETH
      </p>
      <!-- TODO Abstract this out into an "amount" component -->
      <div>
        <!-- TODO Move "styles" to actual styles -->
        <a-input-number
          v-model="amount"
          class="field"
          style="width: 200px"
          placeholder="0.12"
        />
        <span v-if="amountUsd" style="margin-left: 10px">${{ amountUsd }}</span>
      </div>
      <a-button type="primary" @click="payDividend">
        Pay dividend
      </a-button>
    </section>
    <a-spin v-else size="large" />
  </main-content>
</template>

<script>
import { parseEther, formatEther } from '@ethersproject/units'
import MainContent from '@/components/MainContent.vue'

export default {
  components: {
    MainContent
  },
  middleware: [
    'metamask',
    'business',
    ({ store, redirect, route }) => {
      if (!store.state.bountium.business.privileges.callsDividend) {
        return redirect(302, `/business/${route.params.contract}`)
      }
    }
  ],
  data() {
    return {
      amount: null,
      contractBalance: null
    }
  },
  computed: {
    amountUsd() {
      const rate = this.$store.state.bountium.exchangeRate
      const amount = !rate || !this.amount ? null : this.amount * rate

      // Allows prevents against NaN errors
      return amount > 0 ? amount.toFixed(2) : null
    }
  },
  async created() {
    const contractBalance = await this.$store.state.bountium.account
      .ethersProvider()
      .getBalance(this.$store.state.bountium.business.contract.address)
    this.contractBalance = formatEther(contractBalance)
  },
  methods: {
    async payDividend() {
      try {
        const totalShares = await this.$store.state.bountium.business.contract.functions.totalShares()
        const amountPerShare = parseEther(this.amount.toString()).div(
          totalShares
        )

        const task = () =>
          this.$store.state.bountium.business.contract.functions.payDividend(
            amountPerShare
          )

        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Paying out dividends',
          task
        })

        this.$notification.success({
          message: 'Successfully paid out dividends'
        })

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to pay out dividends'
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
