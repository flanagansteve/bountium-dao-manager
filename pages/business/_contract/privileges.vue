<template>
  <main-content :title="$store.state.bountium.business.name">
    <h2>Grant privilege</h2>
    <section style="max-width: 500px">
      <!-- TODO Should this be select-able from a dropdown after loading it? -->
      <label>Ethereum address of stakeholder</label>
      <a-input
        v-model="recipientAddress"
        class="field"
        placeholder="0x5fa32e..."
        @keyup.enter="createBusiness"
      />
      <label>Permission to grant</label>
      <div>
        <a-select
          v-model="privilege"
          default-value="1"
          style="width: 180px"
          class="field"
        >
          <a-select-option value="1">Call dividends</a-select-option>
          <a-select-option value="2">Dilute stakeholders</a-select-option>
          <a-select-option value="3">Manage privileges</a-select-option>
          <a-select-option value="4">Modify catalog</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="bestowPrivilege">
        Assign
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
      if (!store.state.bountium.business.privileges.canBestow) {
        return redirect(302, `/business/${route.params.contract}`)
      }
    }
  ],
  data() {
    return {
      recipientAddress: '',
      privilege: null
    }
  },
  methods: {
    async bestowPrivilege() {
      try {
        const task = () =>
          this.$store.state.bountium.business.contract.functions.bestowPermission(
            this.recipientAddress,
            this.privilege
          )

        const receipt = await this.$store.dispatch(
          'bountium/submitTransaction',
          {
            pendingMessage: 'Granting new privilege',
            task
          }
        )

        this.$notification.success({
          message: 'Successfully granted privilege'
        })

        const wasSuccessful = receipt.events.find(
          ({ event }) => event === 'OwnershipModified'
        )
        if (!wasSuccessful) {
          throw new Error('Failed to grant privilege')
        }

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to grant privilege'
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
