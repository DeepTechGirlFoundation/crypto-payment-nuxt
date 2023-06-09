import { NETWORKS } from "@/constants";
import Usdt from "../../abis/ethereum/usdt";
import Usdc from "../../abis/ethereum/usdc";
import Dai from "../../abis/ethereum/dai";
import Uni from "../../abis/ethereum/uni";
import Weth from "../../abis/ethereum/weth";

const url = NETWORKS[5].scanUrl + '/token'

export default {
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    address: null,
    abi: null,
    url: null,
    icon: require("@/assets/images/symbol/eth.svg"),
    iconPath: "crypto_currency/eth",
    iconType: "png"
  },
  USDT: {
    name: "Teher USD",
    symbol: "USDT",
    address: "0x6AD196dBcd43996F17638B924d2fdEDFF6Fdd677",
    abi: Usdt.abi,
    url: `${url}/0x6AD196dBcd43996F17638B924d2fdEDFF6Fdd677`,
    icon: require("@/assets/images/symbol/usdt.svg"),
    iconPath: "crypto_currency/usdt",
    iconType: "png"
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    abi: Usdc.abi,
    url: `${url}/0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C`,
    icon: require("@/assets/images/symbol/usdc.svg"),
    iconPath: "crypto_currency/usdc",
    iconType: "png"
  },
  DAI: {
    name: "MakerDAO",
    symbol: "DAI",
    address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    abi: Dai.abi,
    url: `${url}/0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60`,
    icon: require("@/assets/images/symbol/dai.svg"),
    iconPath: "crypto_currency/dai",
    iconType: "png"
  },
  UNI: {
    name: "Uniswap",
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    abi: Uni.abi,
    url: `${url}/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`,
    icon: require("@/assets/images/symbol/uni.svg"),
    iconPath: "crypto_currency/uni",
    iconType: "png"
  },
  WETH: {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    abi: Weth.abi,
    url: `${url}/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6`,
    icon: require("@/assets/images/symbol/weth.svg"),
    iconPath: "crypto_currency/weth",
    iconType: "png"
  },
};
