<template>
  <main-content title="Lookup business">
    <section style="max-width: 500px">
      <a-input
        ref="contractAddress"
        v-model="contractAddress"
        class="address-input"
        placeholder="Contract address of business"
        @keyup.enter="lookupBusiness"
      />
      <a-button type="primary" @click="lookupBusiness">
        Lookup
      </a-button>
    </section>
  </main-content>
</template>

<script>
import MainContent from '@/components/MainContent.vue'

export default {
  middleware: 'metamask',
  components: {
    MainContent
  },
  data() {
    return {
      contractAddress:
        window.localStorage.getItem('last-created-business-contract') || ''
    }
  },
  mounted() {
    this.$refs.contractAddress.$el.focus()
  },
  methods: {
    lookupBusiness() {
      // Business middleware has all logic to verify this address
      this.$router.push({
        path: `/business/${this.contractAddress}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.address-input {
  margin: 0 0 20px 0;
}
</style>
