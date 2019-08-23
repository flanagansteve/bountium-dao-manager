<template>
  <main-content :title="$store.state.bountium.business.name">
    <section v-if="stakeholders">
      <h2>Products</h2>
      <nuxt-link to="products/new" append>
        <a-button size="large" type="primary" style="margin: 0 0 20px 0">
          <a-icon type="plus-circle" />Add Product
        </a-button>
      </nuxt-link>
      <!-- TODO Add new product card -->
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
              alt=""
              :src="product.imageUrl"
              class="image-preview"
            />
            <template slot="actions" class="ant-card-actions">
              <nuxt-link :to="`products/${product.productId}`" append>
                <a-tooltip>
                  <template slot="title">
                    Edit product
                  </template>
                  <a-icon type="edit" />
                </a-tooltip>
              </nuxt-link>
              <!-- TODO this -->
              <!-- <nuxt-link to="supply" append> -->
              <a-tooltip>
                <template slot="title">
                  Add supply steps
                </template>
                <a-icon type="global" />
              </a-tooltip>
              <!-- </nuxt-link> -->
            </template>
            <a-card-meta :title="product.name" :description="product.price" />
          </a-card>
        </nuxt-link>
      </section>
      <!-- TODO List all products card -->
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
              {isLocalAddress(ethereumAddress) && (
                <span>&ensp;(logged in)</span>
              )}
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
      ]
    }
  },
  async created() {
    await Promise.all([this.fetchStakeholders(), this.fetchProducts()])
  },
  methods: {
    async fetchStakeholders() {
      const totalShares = await this.$store.state.bountium.business.contract.functions.totalShares()

      const ownerAddresses = await this.fetchNextOwner()
      const stakeholders = await Promise.all(
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

      this.stakeholders = stakeholders
    },
    async fetchProducts() {
      this.products = await this.fetchNextProduct().then((products) =>
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
    // TODO Abstrac these functions?
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
</style>
