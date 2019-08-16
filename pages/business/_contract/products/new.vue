<template>
  <main-content :title="$store.state.bountium.business.name">
    <h2>List new product</h2>
    <edit-product :product="product" />
    <a-button type="primary" class="submit-button" @click="listProduct">
      List Product
    </a-button>
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
    ({ store, redirect }) => {
      if (!store.state.bountium.business.privileges.canModifyCatalogue) {
        const url = `/business/${store.state.bountium.business.contract.address}`
        return redirect(302, url)
      }
    }
  ],
  data() {
    return {
      product: {
        name: '',
        description: '',
        imageUrl: '',
        priceWei: null,
        forSale: false,
        options: '{}'
      }
    }
  },
  methods: {
    async listProduct() {
      try {
        const releaseProduct = this.$store.state.bountium.business.contract
          .functions['releaseProduct(string,string,string,bool,uint256,string)']

        const receipt = await this.$store.dispatch(
          'bountium/submitTransaction',
          {
            pendingMessage: 'Releasing new product',
            task: () =>
              releaseProduct(
                this.product.name,
                this.product.description,
                this.product.imageUrl,
                this.product.forSale,
                this.product.priceWei,
                this.product.options
              )
          }
        )

        this.$notification.success({
          message: 'Successfully released new product'
        })

        const productId = receipt.events
          .find(({ event }) => event === 'ProductReleased')
          .values[1].toString()
        const contractAddress = this.$store.state.bountium.business.contract
          .address
        this.$router.push({
          path: `/business/${contractAddress}/products/${productId}`
        })
      } catch (err) {
        console.error(err)
        this.$notification.error({
          message: 'Failed to release new product'
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
