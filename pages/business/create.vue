<template>
  <main-content title="Create business">
    <section style="max-width: 500px">
      <a-input
        ref="businessName"
        v-model="businessName"
        class="business-input"
        placeholder="Business Name"
        @keyup.enter="createBusiness"
      />
      <a-button type="primary" @click="createBusiness">
        Create
      </a-button>
    </section>
  </main-content>
</template>

<script>
import { ContractFactory } from '@ethersproject/contracts'
import MainContent from '@/components/MainContent.vue'
import AutoBiz from '@/abi/AutoBiz-abi.json'

export default {
  middleware: 'metamask',
  components: {
    MainContent
  },
  data() {
    return {
      businessName: ''
    }
  },
  mounted() {
    this.$refs.businessName.$el.focus()
  },
  methods: {
    async createBusiness() {
      const signer = this.$store.state.bountium.account.ethersProvider.getSigner()
      const factory = new ContractFactory(AutoBiz.abi, AutoBiz.bytecode, signer)

      try {
        let contract

        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Deploying new business',
          task: async () => {
            contract = await factory.deploy(this.businessName)
            return contract.deployTransaction
          }
        })

        this.$notification.success({
          message: 'Successfully deployed new business'
        })

        // Save last created contract to localStorage
        window.localStorage.setItem(
          'last-created-business-contract',
          contract.address
        )

        // Auto redirect to new product page
        this.$router.push({
          path: `/business/${contract.address}/products/new`
        })
      } catch (err) {
        console.error('Failed to deploy new business:', err)
        this.$notification.error({
          message: 'Failed to deploy new business'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.business-input {
  margin: 0 0 20px 0;
}
</style>
