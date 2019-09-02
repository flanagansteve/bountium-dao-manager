<template>
  <!-- TODO Should this 'main-content' component be in the default layout, and just
       conditionally display metamask info if there's an account & business? -->
  <main-content :title="$store.state.bountium.business.name">
    <section v-if="product && orders && supplySteps">
      <h2>Manage product</h2>
      <a :href="twitterLink" target="_blank">
        <a-button icon="twitter">
          Share Product
        </a-button>
      </a>
      <a-divider />
      <h3>Product details</h3>
      <edit-product :product="product" />
      <a-button type="primary" class="submit-button" @click="listProduct">
        Edit Product
      </a-button>
      <a-divider />
      <h3>Orders</h3>
      <a-table
        bordered
        :columns="orderColumns"
        :row-key="(record) => record.index"
        :data-source="orders"
        :pagination="false"
      />
      <a-divider />
      <h3>Supply steps</h3>
      <nuxt-link to="supply-step" append>
        <a-button type="primary" style="margin: 0 0 20px 0">
          <a-icon type="plus-circle" />Add Supply Step
        </a-button>
      </nuxt-link>
      <a-table
        bordered
        :columns="supplyStepsColumns"
        :row-key="(record) => record.index"
        :data-source="supplySteps"
        :pagination="false"
      />
    </section>
    <a-spin v-else size="large" />
  </main-content>
</template>

<script>
import { formatEther } from '@ethersproject/units'
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
    const renderBool = (access) => (
      <a-checkbox default-checked={access} disabled />
    )

    return {
      product: null,
      orders: null,
      orderColumns: [
        {
          title: 'Order info',
          dataIndex: 'orderInfo'
        },
        {
          title: 'Completed',
          dataIndex: 'complete',
          customRender: renderBool
        },
        {
          title: 'Paid suppliers',
          dataIndex: 'suppliersPaid',
          customRender: renderBool
        }
      ],
      supplySteps: null,
      supplyStepsColumns: [
        {
          title: 'Incentiviser',
          dataIndex: 'incentiviser'
        },
        {
          title: 'Description',
          dataIndex: 'description'
        },
        {
          title: 'Fee',
          dataIndex: 'fee'
        }
      ]
    }
  },
  computed: {
    twitterLink() {
      const storefrontUrl = `https://shop.bountium.org/?${this.$store.state.bountium.business.contract.address}/`
      const tweetContent = `Check out our new product, ${this.product.name}! ${storefrontUrl} @bountium`
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetContent
      )}`
    }
  },
  async created() {
    // TODO Handle errors here GRACEFULLY! (if the product doesn't exist)
    // TODO Or add middleware?

    const fetchProduct = this.$store.state.bountium.business.contract.functions.catalogue(
      this.$route.params.product
    )

    // Load all orders for product
    const fetchOrders = this.fetchNextOrder(this.$route.params.product)

    // Load all supply steps for product
    const fetchSupplySteps = this.fetchNextSupplyStep(
      this.$route.params.product
    )

    const [product, orders, supplySteps] = await Promise.all([
      fetchProduct,
      fetchOrders,
      fetchSupplySteps
    ])

    this.product = {
      name: product.name || '',
      description: product.description || '',
      imageUrl: product.imageURL || '',
      priceWei: product.price || null,
      forSale: product.forSale || false,
      options: product.orderOptions || '{}'
    }

    this.orders = orders
    this.supplySteps = supplySteps
  },
  methods: {
    fetchNextOrder(productId, n = 0) {
      return this.$store.state.bountium.business.contract.functions
        .orders(productId, n)
        .then(async (order) => [
          {
            index: n,
            complete: order.complete, // boolean
            suppliersPaid: order.suppliersPaid, // boolean
            orderInfo: order.orderInfo // string
          },
          ...(await this.fetchNextOrder(productId, n + 1))
        ])
        .catch((err) => {
          console.log('Loading orders, reached end of list:', err)
          return []
        })
    },
    fetchNextSupplyStep(productId, n = 0) {
      return this.$store.state.bountium.business.contract.functions
        .supplyChains(productId, n)
        .then(async (step) => [
          {
            index: n,
            description: step.description, // String
            incentiviser: step.incentiviser, // Contract address
            fee: `${formatEther(step.fee)} ETH`
          },
          ...(await this.fetchNextSupplyStep(productId, n + 1))
        ])
        .catch((err) => {
          console.log('Loading supply steps, reached end of list:', err)
          return []
        })
    },
    async addSupplyStep() {
      // TODO Requires productId (given), evaluator (contract address?) (given); fee + instructions
    },
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
