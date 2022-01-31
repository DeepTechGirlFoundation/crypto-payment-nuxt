import { NETWORKS } from '@/constants'

export default {
  ropsten: {
    name: NETWORKS[3].name,
    chainId: NETWORKS[3].chainId,
    rpcUrl: NETWORKS[3].rpcUrl,
    icon: require('@/assets/images/network/ethereum.svg')
  },
  bsc: {
    name: NETWORKS[97].name,
    chainId: NETWORKS[97].chainId,
    rpcUrl: NETWORKS[97].rpcUrl,
    icon: require('@/assets/images/network/binance.svg')
  },
  matic: {
    name: NETWORKS[80001].name,
    chainId: NETWORKS[80001].chainId,
    rpcUrl: NETWORKS[80001].rpcUrl,
    icon: require('@/assets/images/network/matic.svg')
  },
  avalanche: {
    name: NETWORKS[43113].name,
    chainId: NETWORKS[43113].chainId,
    rpcUrl: NETWORKS[43113].rpcUrl,
    icon: require('@/assets/images/network/avalanche.svg')
  }
}