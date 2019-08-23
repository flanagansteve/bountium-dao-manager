<template>
  <main-content :title="$store.state.bountium.business.name">
    <section style="max-width: 500px">
      <h2>Add supply step</h2>
      <label>Fee in ETH</label>
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
      <label>Instructions</label>
      <a-textarea
        v-model="instructions"
        :rows="2"
        class="field"
        style="resize: none"
      />
      <a-button type="primary" @click="addSupplyStep">
        Add Supply Step
      </a-button>
    </section>
  </main-content>
</template>

<script>
import { parseEther } from '@ethersproject/units'
import MainContent from '@/components/MainContent.vue'

export default {
  components: {
    MainContent
  },
  middleware: [
    'metamask',
    'business',
    ({ store, redirect, route }) => {
      if (!store.state.bountium.business.privileges.canModifyCatalogue) {
        return redirect(302, `/business/${route.params.contract}`)
      }
    }
  ],
  data() {
    return {
      amount: null,
      instructions: null
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
  methods: {
    async addSupplyStep() {
      try {
        const fee = parseEther(this.amount.toString())
        const evaluator =
          this.$store.state.bountium.account.chainId === 1
            ? '0xfce2e8c52578026ddaa24899921586591bb73fca'
            : '0xe748d6628cb4f0e87c48509b227b82f831411733'

        const task = () =>
          this.$store.state.bountium.business.contract.functions.addSupplyStep(
            this.$route.params.product,
            evaluator,
            fee,
            this.instructions
          )

        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Adding supply step',
          task
        })

        this.$notification.success({
          message: 'Successfully added supply step'
        })

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        const productId = this.$route.params.product
        this.$router.push({
          path: `/business/${contractAddress}/products/${productId}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to add supply step'
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
