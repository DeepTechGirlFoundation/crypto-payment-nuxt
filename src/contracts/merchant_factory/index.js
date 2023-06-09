import MerchantFactoryAbi from './abis'
import Ethereum from './networks/ethereum'
import Binance from './networks/binance'
import Matic from './networks/matic'
import Avalanche from './networks/avalanche'
import Doge from './networks/doge'
import Astr from './networks/astr'

const networks = [Ethereum, Binance, Matic, Avalanche, Doge, Astr]

let addresses = {}
networks.forEach((network) => {
  addresses[network.chainId] = network.address
})

export default {
  abi: MerchantFactoryAbi.abi,
  addresses: addresses
}
