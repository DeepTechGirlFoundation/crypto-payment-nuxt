<script>
import { METAMASK, WALLET_CONNECT, LOGIN_TOKEN } from '@/constants'
import AvailableNetworks from '@/network'
import RequestUtility from '@/utils/request'
import MerchantContract from '@/contracts/merchant'
import Web3 from 'web3'

export default {
  name: 'MerchantAdminAuthentification',
  computed: {
    $_merchantAdminAuthentification_API_BASE_URL() {
      return process.env.VUE_APP_API_BASE_URL
    }
  },
  methods: {
    authentification(useProvider, loginMode, modalMode) {
      const successFunc = this.$_merchantAdminAuthentification_getConnectSucceededFunction(loginMode, modalMode)
      const failureFunc = this.$_merchantAdminAuthentification_getConnectFailuredFunction(useProvider, loginMode)
      if (loginMode) {
        switch(useProvider) {
          case METAMASK:
            this.useMetaMask(successFunc, failureFunc)
            break
          case WALLET_CONNECT:
            this.useWalletConnect(successFunc, failureFunc)
            break
          default:
            throw new Error('This provider is not supported.')
        }
      } else {
        successFunc(this.$store.state.web3)
      }
    },
    $_merchantAdminAuthentification_getConnectSucceededFunction(loginMode, modalMode) {
      return (connectInfo) => {
        this.$_merchantAdminAuthentification_checkCurrentChain(connectInfo)
          .then(this.$_merchantAdminAuthentification_getAcountData)
          .then(this.$_merchantAdminAuthentification_signWithPrivateKey)
          .then(this.$_merchantAdminAuthentification_apiLoginAuthentification)
          .then(this.$_merchantAdminAuthentification_apiGetMerchantReceiveSymbol)
          .then((authorized) => {
            this.$_merchantAdminAuthentification_authorizedAfrer(authorized, loginMode, modalMode)
            this.$_merchantAdminAuthentification_apiGetMerchantPausedNetworks(authorized)
          })
          .catch((error) => {
            if (
              error instanceof NotSupportedChainError
              && /^(\/admin|\/admin\/)$/.test(this.$route.path)
            ) {
              this.$store.dispatch('modal/show', {
                target: 'error-current-network-for-admin-modal',
                size: 'small'
              })
            }
          })
      }
    },
    $_merchantAdminAuthentification_getConnectFailuredFunction(useProvider, loginMode) {
      return (error) => {
        if (!loginMode) {
          return
        }
        if (useProvider === METAMASK) {
          if (error.name === 'MetamaskNotInstalledError') {
            this.$store.dispatch('modal/show', {
              target: 'error-for-admin-modal',
              size: 'small',
              params: { message: error.message }
            })
          } else {
            this.$store.dispatch('modal/show', { target: 'error-metamask-for-admin-modal', size: 'small'})
          }
        } else if (useProvider === WALLET_CONNECT) {
          this.$store.dispatch('modal/show', { target: 'error-wallet-for-admin-modal', size: 'small'})
        } else {
          this.$store.dispatch('modal/show', {
            target: 'error-for-admin-modal',
            size: 'small',
            params: { message: 'Please authenticate again.' }
          })
        }
      }
    },
    $_merchantAdminAuthentification_checkCurrentChain(connectInfo) {
      return new Promise((resolve) => {
        if (connectInfo.provider !== WALLET_CONNECT) {
          resolve(connectInfo);
        }

        const systemAvailableNetworks =
          Object.values(AvailableNetworks)
            .map((network) => { return network.chainId})

        if (systemAvailableNetworks.includes(connectInfo.chainId)) {
          resolve(connectInfo);
        } else {
          throw new NotSupportedChainError()
        }
      })
    },
    $_merchantAdminAuthentification_getAcountData(connectInfo) {
      return this.$web3.getAccountData(
        connectInfo.instance,
        connectInfo.chainId
      ).then((account) => {
        return {
          web3: connectInfo,
          account: account
        }
      })
    },
    $_merchantAdminAuthentification_signWithPrivateKey(connectInfo) {
      return this.$web3.signWithPrivateKey(
        connectInfo.web3.instance,
        connectInfo.account.address
      ).then((signature) => {
        connectInfo.authorize = { signature: signature }
        return connectInfo
      })
    },
    $_merchantAdminAuthentification_apiLoginAuthentification(connectInfo) {
      const url = `${this.$_merchantAdminAuthentification_API_BASE_URL}/api/v1/management/connect`
      const params = {
        address: connectInfo.account.address,
        signature: connectInfo.authorize.signature
      }
      return this.axios.post(url, params).then((apiResponse) => {
        connectInfo.authorized = apiResponse.data
        return connectInfo
      })
    },
    $_merchantAdminAuthentification_apiGetMerchantReceiveSymbol(connectInfo) {
      const url = `${this.$_merchantAdminAuthentification_API_BASE_URL}/api/v1/management/setting/token`
      const request = { headers: { Authorization: RequestUtility.getBearer(connectInfo.authorized.login_token) } }
      return this.axios.get(url, request).then((apiResponse) => {
        connectInfo.account.receiveSymbol = apiResponse.data.symbol
        return connectInfo
      })
    },
    $_merchantAdminAuthentification_apiGetMerchantPausedNetworks(
      authorizedData
    ) {
      const url = `${this.$_merchantAdminAuthentification_API_BASE_URL}/api/v1/management/merchant/status`
      const request = {
        headers: {
          Authorization: RequestUtility.getBearer(
            authorizedData.authorized.login_token
          )
        }
      }
      return this.axios.get(url, request).then((apiResponse) => {
        const status = {}
        const funcGetContractPaused = []
        const web3Instance = new Web3()
        for (const chainId in apiResponse.data) {
          funcGetContractPaused.push(
            this.$web3.checkMerchantContractPaused(
              web3Instance,
              MerchantContract.abi,
              { chainId, address: apiResponse.data[chainId] }
            )
          )
          status[chainId] = true
        }
        Promise.all(funcGetContractPaused).then((response) => {
          for (const result of response) {
            status[result.chainId] = result.paused
          }

          this.$store.dispatch(
            'merchant/updatePausedNetworkStatus',
            status
          )
        })
      })
    },
    $_merchantAdminAuthentification_authorizedAfrer(authorizedData, loginMode, modalMode) {
      localStorage.setItem(LOGIN_TOKEN, authorizedData.authorized.login_token)
      this.$store.dispatch('account/update', authorizedData.account)
      this.$store.dispatch('account/updateReceiveSymbol', authorizedData.account.receiveSymbol)
      this.$store.dispatch('account/updateNote', authorizedData.authorized.note)
      if (loginMode) {
        this.$store.dispatch('web3/update', authorizedData.web3)
        if (modalMode) {
          this.$store.dispatch('modal/hide')
        }
        this.$router.push({ path: '/admin/dashboard' })
      } else {
        if (authorizedData.authorized.initialized || this.$router.currentRoute.path === '/admin/dashboard') {
          this.$router.go({ path: this.$router.currentRoute.path, force: true })
        } else {
          this.$router.push({ path: '/admin/dashboard' })
        }
      }
    }
  }
}

class NotSupportedChainError extends Error {
  constructor() {
    super('The currently connected network is not supported')
    this.name = 'NotSupportedChainError'
  }
}
</script>
