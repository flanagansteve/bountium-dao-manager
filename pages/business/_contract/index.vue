<template>
  <main-content :title="$store.state.bountium.business.name">
    <section v-if="stakeholders && orders && products">
      <h2>Products</h2>
      <section class="product-container">
        <nuxt-link
          v-for="product in products"
          :key="product.productId"
          :to="`products/${product.productId}`"
          append
          tag="div"
          class="product"
        >
          <a-card hoverable style="width: 220px">
            <img
              slot="cover"
              :src="product.imageUrl"
              alt=""
              class="image-preview"
            />
            <a-card-meta :title="product.name" :description="product.price" />
          </a-card>
        </nuxt-link>
        <nuxt-link to="products/new" tag="div" append>
          <a-card class="add-product-card" hoverable>
            <a-icon
              type="plus-circle"
              size="large"
              class="add-product-card__icon"
            />Add Product
          </a-card>
        </nuxt-link>
      </section>
      <section class="orders-container">
        <h2>Orders</h2>
        <a-table
          bordered
          :columns="orderColumns"
          :row-key="(record) => record.id"
          :data-source="orders"
          :pagination="false"
          class="orders-table"
        >
          <template slot="product-link" slot-scope="productId">
            <nuxt-link
              :to="{
                path: `products/${productId}`,
                append: true
              }"
              >{{
                products.find((details) => details.productId === productId).name
              }}</nuxt-link
            >
          </template>
          <template slot="order-info" slot-scope="orderInfo">
            <ul>
              <li v-for="(val, key) in orderInfo" :key="key">
                {{ key }}: {{ val }}
              </li>
            </ul>
          </template>
        </a-table>
      </section>
      <h2>Stakeholders</h2>
      <a-table
        bordered
        :columns="columns"
        :row-key="(record) => record.ownerAddress"
        :data-source="stakeholders"
        :pagination="false"
      />
    </section>
    <a-spin v-else size="large" />
  </main-content>
</template>

<script>
import { formatEther } from '@ethersproject/units'
import MainContent from '@/components/MainContent.vue'
import EthereumAddress from '@/components/EthereumAddress.vue'

export default {
  components: {
    MainContent,
    // eslint-disable-next-line vue/no-unused-components
    EthereumAddress
  },
  middleware: ['metamask', 'business'],
  data() {
    const renderBool = (access) => (
      <a-checkbox default-checked={access} disabled />
    )

    const isLocalAddress = (address) =>
      address.toLowerCase() ===
      this.$store.state.bountium.account.ethereumAddress.toLowerCase()

    return {
      products: null,
      stakeholders: null,
      columns: [
        {
          title: 'Address',
          dataIndex: 'ownerAddress',
          customRender: (ethereumAddress) => (
            <span>
              <ethereum-address address={ethereumAddress} concat={true} />
              {isLocalAddress(ethereumAddress) && <span>&ensp;(you)</span>}
            </span>
          )
        },
        {
          title: 'Ownership %',
          dataIndex: 'percentOwner'
        },
        {
          title: 'Privileges',
          children: [
            {
              title: 'Call Dividends',
              dataIndex: 'callsDividend',
              customRender: renderBool
            },
            {
              title: 'Dilute',
              dataIndex: 'canDilute',
              customRender: renderBool
            },
            {
              title: 'Bestow',
              dataIndex: 'canBestow',
              customRender: renderBool
            },
            {
              title: 'Modify Catalog',
              dataIndex: 'canModifyCatalogue',
              customRender: renderBool
            }
          ]
        }
      ],
      orders: null,
      orderColumns: [
        {
          title: 'Product',
          dataIndex: 'productId',
          scopedSlots: {
            customRender: 'product-link'
          }
        },
        {
          title: 'Order ID',
          dataIndex: 'index'
        },
        {
          title: 'Order info',
          dataIndex: 'orderInfo',
          scopedSlots: {
            customRender: 'order-info'
          }
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
      ]
    }
  },
  async created() {
    const products = this.fetchProducts()
    const stakeholders = this.fetchStakeholders()

    this.products = await products
    this.stakeholders = await stakeholders

    /**
     * Must wait until products are loaded first, list length cannot
     * be determined unless contract exposes getter function
     */
    this.orders = await this.fetchOrders()
  },
  methods: {
    async fetchStakeholders() {
      const totalShares = await this.$store.state.bountium.business.contract.functions.totalShares()

      const ownerAddresses = await this.fetchNextOwner()
      return Promise.all(
        ownerAddresses.map(async (ownerAddress) => {
          const stakeholder = await this.$store.state.bountium.business.contract.functions.owners(
            ownerAddress
          )

          // Parse this into a more manage-able format
          return {
            ownerAddress,
            percentOwner:
              ((+stakeholder.stake / +totalShares) * 100).toFixed(2) + '%',
            callsDividend: stakeholder.callsDividend,
            canDilute: stakeholder.canDilute,
            canBestow: stakeholder.canBestow,
            canModifyCatalogue: stakeholder.canModifyCatalogue
          }
        })
      )
    },
    fetchNextOwner(n = 0) {
      return this.$store.state.bountium.business.contract.functions
        .ownersRegistered(n)
        .then(async (ownerAddress) => [
          ownerAddress,
          ...(await this.fetchNextOwner(n + 1))
        ])
        .catch((err) => {
          console.log('Reached end of list:', err)
          return []
        })
    },
    fetchProducts() {
      return this.fetchNextProduct().then((products) =>
        products.map((product, index) => {
          const price = +formatEther(product.price)
          const rate = this.$store.state.bountium.exchangeRate
          const usdPrice = (price * rate).toFixed(2)

          return {
            productId: index,
            imageUrl: product.imageURL,
            name: product.name,
            price: `${price} ETH ($${usdPrice})`
          }
        })
      )
    },
    fetchNextProduct(n = 0) {
      return this.$store.state.bountium.business.contract.functions
        .catalogue(n)
        .then(async (product) => [
          product,
          ...(await this.fetchNextProduct(n + 1))
        ])
        .catch((err) => {
          console.log('Reached end of list:', err)
          return []
        })
    },
    async fetchOrders() {
      const orders = await Promise.all(
        this.products.map((product) => this.fetchNextOrder(product.productId))
      )

      return orders.flat() // Flatten the nested arrays
    },
    fetchNextOrder(productId, n = 0) {
      return this.$store.state.bountium.business.contract.functions
        .orders(productId, n)
        .then(async (order) => [
          {
            id: this.generateOrderId(productId, n), // Unique ID for lists
            productId,
            index: n,
            complete: order.complete, // boolean
            suppliersPaid: order.suppliersPaid, // boolean
            orderInfo: JSON.parse(order.orderInfo) // Stringified JSON as key-value pairs
          },
          ...(await this.fetchNextOrder(productId, n + 1))
        ])
        .catch((err) => {
          console.log('Loading orders, reached end of list:', err)
          return []
        })
    },
    generateOrderId(productId, index) {
      return `productId:${productId}:orderIndex${index}`
    }
  }
}
</script>

<style lang="less" scoped>
.image-preview {
  width: 100%;
  height: 100%;
  background: lightgray;

  &:before {
    content: ' ';
    font-size: 1000px;
  }
}

.product-container {
  display: flex;
  flex-flow: row wrap;
  margin: 0 -30px 0 0;
}

.product {
  margin: 0 30px 30px 0;
}

.add-product-card {
  width: 220px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  border: 1px dashed #e8e8e8;

  .add-product-card__icon {
    margin-right: 6px;
  }
}

.orders-container {
  margin: 0 0 30px 0;
}
</style>
