import { NETWORKS } from "@/constants";
import Usdt from "../../abis/binance/usdt";
import Busd from "../../abis/binance/busd";
import Cake from "../../abis/binance/cake";
import Wbnb from "../../abis/binance/wbnb";

const url = NETWORKS[97].scanUrl + '/token'

export default {
  BNB: {
    name: "Binance",
    symbol: "BNB",
    address: null,
    abi: null,
    url: null,
    icon: require("@/assets/images/symbol/bnb.svg"),
    iconPath: "token-bnb",
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684",
    abi: Usdt.abi,
    url: `${url}/0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684`,
    icon: require("@/assets/images/symbol/usdt.svg"),
    iconPath: "token-usdt",
  },
  BUSD: {
    name: "Binance USD",
    symbol: "BUSD",
    address: "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
    abi: Busd.abi,
    url: `${url}/0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7`,
    icon: require("@/assets/images/symbol/busd.svg"),
    iconPath: "token-busd",
  },
  CAKE: {
    name: "PancakeSwap",
    symbol: "CAKE",
    address: "0xF9f93cF501BFaDB6494589Cb4b4C15dE49E85D0e",
    abi: Cake.abi,
    url: `${url}/0xF9f93cF501BFaDB6494589Cb4b4C15dE49E85D0e`,
    icon: require("@/assets/images/symbol/cake.svg"),
    iconPath: "token-cake",
  },
  WBNB: {
    name: "Wrapped BNB",
    symbol: "WBNB",
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    abi: Wbnb.abi,
    url: `${url}/0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd`,
    icon: require("@/assets/images/symbol/wbnb.svg"),
    iconPath: "token-wbnb",
  },
};
