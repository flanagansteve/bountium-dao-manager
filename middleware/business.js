import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import AutoBiz from '../abi/AutoBiz-abi.json'

export default async function({ route, store, redirect }) {
  const contractAddress = route.params.contract

  // TODO Failing to lookup contract should display a toast (tough because no access to $notification)

  if (!isAddress(contractAddress)) {
    return redirect(302, '/business/lookup')
  }

  const signer = store.state.bountium.account
    .ethersProvider()
    .getUncheckedSigner()
  const contract = new Contract(
    contractAddress,
    AutoBiz.abi,
    store.state.bountium.account.ethersProvider()
  )
  const contractWithSigner = contract.connect(signer)

  let name
  try {
    name = await contract.functions.biz_name()
  } catch (err) {
    console.error('Failed to lookup biz_name property on contract:', err)
    return redirect(302, '/business/lookup')
  }

  // Ensure the user actually has privileges over the business
  let privileges
  const ethereumAddress = store.state.bountium.account.ethereumAddress
  try {
    const stakeholder = await contractWithSigner.functions.owners(
      ethereumAddress
    )

    privileges = {
      stake: stakeholder.stake,
      callsDividend: stakeholder.callsDividend,
      canDilute: stakeholder.canDilute,
      canBestow: stakeholder.canBestow,
      canModifyCatalogue: stakeholder.canModifyCatalogue
    }
  } catch (err) {
    console.error(
      'Failed to lookup privileges of ',
      ethereumAddress,
      'for business:',
      err
    )
    return redirect(302, '/business/lookup')
  }

  // If the user has no privileges, redirect to lookup page
  if (
    privileges.stake.isZero() &&
    !privileges.callsDividend &&
    !privileges.canDilute &&
    !privileges.canBestow &&
    !privileges.canModifyCatalogue
  ) {
    console.error(ethereumAddress, 'has no privileges and no stake')
    return redirect(302, '/business/lookup')
  }

  store.commit('bountium/SET_BUSINESS_CONTRACT', {
    contract: contractWithSigner,
    privileges,
    name
  })
}
