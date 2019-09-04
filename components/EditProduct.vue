<template>
  <main class="product">
    <section class="product__details">
      <label>Name of product</label>
      <a-input
        v-model="product.name"
        class="field"
        placeholder="White T-Shirt"
      />
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
      <label>For sale</label>
      <div>
        <a-switch v-model="product.forSale" class="field" />
      </div>
      <!-- TODO This is not currently working -->
      <label>Options</label>
      <div class="field">
        <div v-for="(options, tagName) in tags" :key="tagName">
          {{ tagName }}
          <a-tag
            v-for="option in options"
            :key="option"
            :closable="true"
            :after-close="() => removeTag(tag)"
            >{{ option }}</a-tag
          >
          <a-tag
            style="background: #fff; borderStyle: dashed;"
            @click="showTagInput"
          >
            <a-icon type="plus" /> New SKU
          </a-tag>
        </div>
        <!-- <a-table
          :columns="optionsColumns"
          :row-key="(tag) => tag.option"
          :data-source="tags"
          :pagination="false"
          bordered
        > -->
        <!-- <template slot-scope="values" name="tags"> </template> -->
        <!-- </a-table> -->
        <!-- <template v-for="tag in tags">
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
        </a-tag> -->
      </div>
    </section>
    <section class="product__image-thumbnail">
      <img :src="product.imageUrl" class="product__image-thumbnail__img" />
    </section>
  </main>
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
      tags: {},
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
      this.product.options = JSON.stringify(this.tags)
    }
  },
  created() {
    try {
      this.tags = JSON.parse(this.product.options)
    } catch (err) {
      console.error('Error parsing product options:', err)
    }

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

.product {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;

  &__image-thumbnail {
    width: 160px;
    height: 160px;
    margin-left: 40px;
    flex: 0 1;

    &__img {
      height: 100%;
      overflow: hidden;

      &:before {
        content: ' ';
        font-size: 1000px;
      }
    }
  }

  &__details {
    max-width: 500px;
    flex: 1 0;
  }
}
</style>
