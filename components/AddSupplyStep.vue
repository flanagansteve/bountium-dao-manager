<template>
  <a-modal
    v-model="visible"
    title="Add Supply Step"
    @cancel="$emit('hide-supply-step')"
  >
    <section>
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
      <a-alert
        message="What do you need done when an order is received?"
        description="Direct a supplier on how to use customer information and correctly fulfill the order."
        type="info"
        show-icon
        class="field"
      />
      <label>Instructions</label>
      <a-textarea
        v-model="instructions"
        :rows="2"
        class="field"
        style="resize: none"
      />
    </section>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">Cancel</a-button>
      <a-button type="primary" @click="addSupplyStep">
        Add Supply Step
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { parseEther } from '@ethersproject/units'

export default {
  props: {
    visible: {
      require: true,
      type: Boolean
    }
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
    handleCancel() {
      this.$emit('hide-supply-step')
    },
    async addSupplyStep() {
      this.$emit('hide-supply-step')

      try {
        const fee = parseEther(this.amount.toString())
        const evaluator =
          this.$store.state.bountium.account.chainId === 1
            ? '0xfce2e8c52578026ddaa24899921586591bb73fca' // Mainnet
            : '0xe748d6628cb4f0e87c48509b227b82f831411733' // Ropsten

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
