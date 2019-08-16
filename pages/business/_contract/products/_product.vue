<template>
  <!-- TODO Should this 'main-content' component be in the default layout, and just
       conditionally display metamask info if there's an account & business? -->
  <main-content :title="$store.state.bountium.business.name">
    <section v-if="product">
      <h2>View and edit product</h2>
      <edit-product :product="product" />
      <a-button type="primary" class="submit-button" @click="listProduct">
        Edit Product
      </a-button>
    </section>
    <a-spin v-else size="large" />
  </main-content>
</template>

<script>
import MainContent from '@/components/MainContent.vue'
import EditProduct from '@/components/EditProduct.vue'

export default {
  components: {
    MainContent,
    EditProduct
  },
  middleware: [
    'metamask',
    'business',
    // TODO Abstract these to a common middleware function? (abstract all the pricileges?)
    ({ store, redirect }) => {
      if (!store.state.bountium.business.privileges.canModifyCatalogue) {
        const url = `/business/${store.state.bountium.business.contract.address}`
        return redirect(302, url)
      }
    }
  ],
  data() {
    return {
      product: null
    }
  },
  // TODO Add loading screen for all this info!!!
  async created() {
    // TODO Handle errors here GRACEFULLY! (if the product doesn't exist)

    const product = await this.$store.state.bountium.business.contract.functions.catalogue(
      this.$route.params.product
    )

    this.product = {
      name: product.name || '',
      description: product.description || '',
      imageUrl: product.imageURL || '',
      priceWei: product.price || null,
      forSale: product.forSale || false,
      options: product.orderOptions || '{}'
    }
  },
  methods: {
    async listProduct() {
      try {
        await this.$store.dispatch('bountium/submitTransaction', {
          pendingMessage: 'Updating product',
          task: () =>
            this.$store.state.bountium.business.contract.functions.setProduct(
              this.$route.params.product,
              this.product.name,
              this.product.description,
              this.product.imageUrl,
              this.product.forSale,
              this.product.priceWei,
              this.product.options
            )
        })

        this.$notification.success({
          message: 'Successfully updated product'
        })

        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to update product'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.submit-button {
  margin: 10px 0 0 0;
}
</style>
