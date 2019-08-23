import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'

export const state = () => ({
  account: null,
  business: {},
  transaction: null,
  exchangeRate: null
})

// Supports Mainnet & Ropsten (TODO Added Kovan for testing...)
const supportedChains = [1, 3, 42]

export const mutations = {
  SET_ETHEREUM_PROVIDER(state) {
    const chainId = +window.ethereum.networkVersion
    if (!supportedChains.includes(chainId)) {
      // TODO Show an error toast when this happens
      throw new Error('Selected chain in MetaMask is unsupported')
    }

    // If the default account changes, reload the entire page
    window.ethereum.on('accountsChanged', () => {
      location.reload()
    })

    // By default, MetaMask is *supposed* to auto reload when the network changes...
    // ...but this isn't working (!?), so do it manually
    window.ethereum.on('networkChanged', () => {
      location.reload()
    })

    const provider = new Web3Provider(window.ethereum)

    /**
     * Without Object.freeze, throws a "Maximum callstack size exceeded" error (!?)
     * Possibly to do with Vue's change detection adding the deep getters/setters to window.ethereum (!?)
     */
    state.account = {
      ethersProvider: () => provider,
      ethereumAddress: window.ethereum.selectedAddress,
      chainId
    }
  },
  SET_BUSINESS_CONTRACT(state, { contract, name, privileges }) {
    state.business = Object.freeze({
      contract,
      privileges,
      name
    })
  },
  SET_PENDING_TRANSACTION(state, payload) {
    state.transaction = payload
  },
  REMOVE_PENDING_TRANSACTION(state) {
    state.transaction = null
  },
  SET_EXCHANGE_RATE(state, rate) {
    state.exchangeRate = rate
  }
}

export const actions = {
  async submitTransaction({ commit }, { task, pendingMessage }) {
    commit('SET_PENDING_TRANSACTION', { pendingMessage })

    try {
      // Run operation to get transaction result
      const tx = await task()

      commit('SET_PENDING_TRANSACTION', { pendingMessage, txHash: tx.hash })

      // Wait 1 confirmation for transaction receipt
      const receipt = await tx.wait(1)

      /**
       * Per EIP 658, a receipt of 1 indicates the tx was successful:
       * https://github.com/Arachnid/EIPs/blob/d1ae915d079293480bd6abb0187976c230d57903/EIPS/eip-658.md
       */
      if (receipt.status !== 1) {
        throw new Error('Ethereum transaction reverted by the EVM')
      }

      // Wait an additional 3 seconds to ensure Infura state is updated (yikes!)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      commit('REMOVE_PENDING_TRANSACTION')
      return receipt
    } catch (err) {
      commit('REMOVE_PENDING_TRANSACTION')
      throw err
    }
  },
  async fetchExchangeRate({ commit }) {
    const { data } = await axios.get('https://api.coincap.io/v2/rates/ethereum')
    commit('SET_EXCHANGE_RATE', data.data.rateUsd)
  }
}

export const getters = {
  etherscanUrl(state) {
    return state.account
      ? `https://${
          state.account.chainId === 3
            ? 'ropsten.'
            : state.account.chainId === 42
            ? 'kovan.'
            : ''
        }etherscan.io/`
      : null
  }
}
