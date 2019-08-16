<template>
  <section style="max-width: 500px">
    <label>Name of product</label>
    <a-input v-model="product.name" class="field" placeholder="White T-Shirt" />
    <label>Price in ETH</label>
    <div>
      <!-- TODO Move "styles" to actual styles -->
      <a-input-number
        v-model="price"
        class="field"
        style="width: 200px"
        placeholder="0.12"
      />
      <span v-if="priceUsd" style="margin-left: 10px">${{ priceUsd }}</span>
    </div>
    <label>Description</label>
    <a-textarea
      v-model="product.description"
      :rows="2"
      class="field"
      style="resize: none"
      placeholder="Stretch cotton. Lightweight feel."
    />
    <label>Image URL</label>
    <a-input
      v-model="product.imageUrl"
      type="url"
      placeholder="http://placehold.jp/150x150.png"
      class="field"
    />
    <!-- TODO Add image preview -->
    <!-- <img :src="imageUrl" class="image-preview" /> -->
    <label>For sale</label>
    <div>
      <a-switch v-model="product.forSale" class="field" />
    </div>
    <label>Options</label>
    <p style="font-size: 9pt; margin: 0">
      Format using key-value pairs, such as "size: small".
    </p>
    <div class="field">
      <template v-for="tag in tags">
        <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
          <a-tag
            :key="tag"
            :closable="true"
            :after-close="() => removeTag(tag)"
          >
            {{ `${tag.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag
          v-else
          :key="tag"
          :closable="true"
          :after-close="() => removeTag(tag)"
        >
          {{ tag }}
        </a-tag>
      </template>
      <a-input
        v-if="tagInput.visible"
        ref="input"
        type="text"
        size="small"
        :style="{ width: '78px' }"
        :value="tagInput.value"
        @change="updateTagInput"
        @blur="addNewTag"
        @keyup.enter="addNewTag"
      />
      <a-tag
        v-else
        style="background: #fff; borderStyle: dashed;"
        @click="showTagInput"
      >
        <a-icon type="plus" /> New SKU
      </a-tag>
    </div>
  </section>
</template>

<script>
import { parseEther, formatEther } from '@ethersproject/units'

export default {
  props: {
    /**
     * interface Product {
     *   name: string
     *   description: string
     *   imageUrl: string
     *   priceWei: BN | null
     *   forSale: boolean
     *   options: string
     * }
     */
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      price: null, // Price in ETH
      tags: [],
      tagInput: {
        visible: false,
        value: ''
      }
    }
  },
  computed: {
    priceUsd() {
      const rate = this.$store.state.bountium.exchangeRate
      const price = !rate || !this.price ? null : this.price * rate

      // Allows prevents against NaN errors
      return price > 0 ? price.toFixed(2) : null
    }
  },
  watch: {
    price() {
      try {
        // String (ETH) -> BigNumber (wei)
        this.product.priceWei = parseEther(String(this.price))
      } catch (err) {
        this.product.priceWei = null
      }
    },
    tags() {
      const options = this.tags
        // Create array of tuples for each key-value pair
        .map((tag) => tag.split(': '))
        // Create object { key1: [val1, val2, ...], ... }
        .reduce(
          (obj, [key, val]) => ({
            ...obj,
            [key]: obj[key] ? [...obj[key], val] : [val]
          }),
          {}
        )

      this.product.options = JSON.stringify(options)
    }
  },
  created() {
    const tags = []
    try {
      const options = JSON.parse(this.product.options)
      for (const key in options) {
        for (const val of options[key]) {
          tags.push(`${key}: ${val}`)
        }
      }
    } catch (err) {
      console.error('Error parsing product options:', err)
    }
    this.tags = tags

    this.price = this.product.priceWei
      ? formatEther(this.product.priceWei)
      : null
  },
  methods: {
    removeTag(removedTag) {
      const tags = this.tags.filter((tag) => tag !== removedTag)
      this.tags = tags
    },
    showTagInput() {
      this.tagInput.visible = true
      this.$nextTick(function() {
        this.$refs.input.focus()
      })
    },
    updateTagInput(e) {
      this.tagInput.value = e.target.value
    },
    addNewTag() {
      const inputValue = this.tagInput.value

      this.tagInput.visible = false
      this.tagInput.value = ''

      if (!inputValue) {
        return
      }

      // Validate the key-value pair is formatted correctly
      const [key, value] = inputValue.split(': ')
      if (!key || !value) {
        return this.$notification.error({
          message: 'Option incorrectly formatted'
        })
      }

      let tags = this.tags
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue]
      }

      this.tags = tags
    }
  }
}
</script>

<style lang="less" scoped>
.field {
  margin: 5px 0 15px 0;
}

.image-preview {
  width: 120px;
  height: 120px;
  background-image: url('http://placehold.jp/120x120.png');
  overflow: hidden;

  &:before {
    content: ' ';
    font-size: 1000px;
  }
}
</style>
