const store = {
  namespaced: true,
  state: {
    id: null,
    headerInvoice: false,
    domain: null,
    isVerifiedDomain: false,
    merchantWalletAddress: null,
    isAgreeRisk: false,
    orderCode: null,
    amount: null,
    amountWei: null,
    symbol: null,
    decimalUnit: null,
    fee: null,
    transactionHash: null,
    availableNetworks: [],
    status: 1,
    allowCurrencies: {
      USD: false,
      JPY: false,
      EUR: false,
      AED: false,
      SGD: false,
      HKD: false,
      CAD: false,
      IDR: false,
      PHP: false,
      INR: false,
      KRW: false
    },
    token: {
      name: null,
      symbol: null,
      decimal: null,
      address: null,
      balance: null,
      amount: null
    },
    payment_token: null,
    successReturnUrl: null,
    failReturnUrl: null
  },
  actions: {
    initialize({ commit }) {
      commit('initialize')
    },
    initializeForBeforeConnectWallet({ commit }) {
      commit('initializeForBeforeConnectWallet')
    },
    update({ commit }, payload) {
      commit('update', payload)
    },
    updateHeaderInvoice({ commit }, payload) {
      commit('updateHeaderInvoice', payload)
    },
    updateAgreeRiskStatus({ commit }, payload) {
      commit('updateAgreeRiskStatus', payload)
    },
    updateIsVerifiedDomain({ commit }, payload) {
      commit('updateIsVerifiedDomain', payload)
    },
    updateMerchantWalletAddress({ commit }, payload) {
      commit('updateMerchantWalletAddress', payload)
    },
    updateAmount({ commit }, payload) {
      commit('updateAmount', payload)
    },
    updateAmountWei({ commit }, payload) {
      commit('updateAmountWei', payload)
    },
    updateFee({ commit }, payload) {
      commit('updateFee', payload)
    },
    updateDecimalUnit({ commit }, payload) {
      commit('updateDecimalUnit', payload)
    },
    updateTransactionHash({ commit }, payload) {
      commit('updateTransactionHash', payload)
    },
    updateAvailableNetworks({ commit }, payload) {
      commit('updateAvailableNetworks', payload)
    },
    updateStatus({ commit }, payload) {
      commit('updateStatus', payload)
    },
    updateAllowCurrencies({ commit }, payload) {
      commit('updateAllowCurrencies', payload)
    },
    updateToken({ commit }, payload) {
      commit('updateToken', payload)
    },
    updatePaymentToken({ commit }, payload) {
      commit('updatePaymentToken', payload)
    },
    updateBestExchange({ commit }, payload) {
      commit('updateBestExchange', payload)
    },
  },
  mutations: {
    initialize(state) {
      state.id = null
      state.headerInvoice = false
      state.domain = null
      state.isVerifiedDomain = false
      state.merchantWalletAddress = null
      state.isAgreeRisk = false
      state.orderCode = null
      state.amount = null
      state.amountWei = null
      state.symbol = null
      state.fee = null
      state.decimalUnit = null
      state.transactionHash = null
      state.availableNetworks = []
      state.status = 1
      state.allowCurrencies = {
        USD: false,
        JPY: false,
        EUR: false,
        AED: false
      },
      state.token = {
        name: null,
        symbol: null,
        decimal: null,
        address: null,
        balance: null,
        amount: null
      },
      state.successReturnUrl = null,
      state.failReturnUrl = null
    },
    initializeForBeforeConnectWallet(state) {
      state.amountWei = null
      state.fee = null
      state.token = {
        name: null,
        symbol: null,
        decimal: null,
        address: null,
        balance: null,
        amount: null
      }
    },
    update(state, payload) {
      Object.entries(payload).forEach(([key, value]) => {
        state[key] = value
      })
    },
    updatePaymentToken(state, payload) {
      state.payment_token = payload
    },
    updateHeaderInvoice(state, payload) {
      state.headerInvoice = payload
    },
    updateIsVerifiedDomain(state, payload) {
      state.isVerifiedDomain = payload
    },
    updateAgreeRiskStatus(state, payload) {
      state.isAgreeRisk = payload
    },
    updateMerchantWalletAddress(state, payload) {
      state.merchantWalletAddress = payload
    },
    updateAmount(state, payload) {
      state.amount = payload
    },
    updateAmountWei(state, payload) {
      state.amountWei = payload
    },
    updateFee(state, payload) {
      state.fee = payload
    },
    updateDecimalUnit(state, payload) {
      state.decimalUnit = payload
    },
    updateStatus(state, payload) {
      state.status = payload
    },
    updateTransactionHash(state, payload) {
      state.transactionHash = payload
    },
    updateAvailableNetworks(state, payload) {
      state.availableNetworks = payload
    },
    updateAllowCurrencies(state, payload) {
      Object.entries(payload).forEach(([key, value]) => {
        state.allowCurrencies[key] = value
      })
    },
    updateToken(state, payload) {
      Object.entries(payload).forEach(([key, value]) => {
        state.token[key] = value
      })
    },
  }
}

export default store