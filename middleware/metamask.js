export default async function({ store, redirect }) {
  if (typeof window.ethereum !== 'undefined') {
    const metamaskProvider = window.ethereum
    try {
      await metamaskProvider.enable()
      store.commit('bountium/SET_ETHEREUM_PROVIDER')
    } catch (err) {
      console.error('Connecting MetaMask failed:', err)
      // TODO Show prompt that user denied MetaMask
      redirect(302, '/metamask')
    }
  } else {
    console.log(`MetaMask unavailable, redirecting to install`)
    redirect(302, '/metamask')
  }
}
