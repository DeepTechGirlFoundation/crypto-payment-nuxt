<template>
  <PaymentModal
    title="Select a Network"
    :text="
      unsupported
        ? 'The current network is unsupported.<br />Select a network of tokens to pay for.'
        : 'Select a network of tokens to pay for.'
    "
    :close-display="!unsupported || !required"
  >
    <!-- v-if : もしいずれかひとつのnetworkに選択されていたら-->
    <PaymentButton
      class="allnetwork"
      icon="logo-icon"
      text="All Network (some not shown)"
      size="m"
      @click.native="switchNetwork(0)"
    />
    <PaymentButton
      v-for="(network, key) in networks"
      :key="key"
      :class="{
        __pg: isCurrentNetwork(network.chainId),
        half: !isNetworkOnlyOne,
        full: isNetworkOnlyOne,
        'mb-0': isNetworkOnlyOne
      }"
      @click.native="switchNetwork(network.chainId)"
      :text="network.name"
      :icon="network.iconPath"
      size="m"
    />
    <div class="d-btnwrap bottomCloseBtn" v-if="!unsupported || !required">
      <PaymentButton
        color="cancel"
        text="CLOSE"
        icon="dismiss"
        size="s"
        @click.native="hideModal()"
      />
    </div>
  </PaymentModal>
</template>

<script>
import AvailableNetworks from '@/network'
import PaymentModal from '@/components/organisms/Payment/Modal'
import PaymentButton from '@/components/organisms/Payment/Button'
export default {
  name: 'networkModal',
  data() {
    return {
      networks: []
    }
  },
  components: {
    PaymentButton,
    PaymentModal
  },
  computed: {
    classes() {
      const classes = ['modal-box', `--${this.$store.state.modal.size}`]
      return classes
    },
    chainId() {
      return this.$store.state.web3.chainId
    },
    paymentAvailableNetworks() {
      return this.$store.state.payment.availableNetworks
    },
    isCurrentNetwork() {
      return (chainId) => {
        return chainId === this.$store.state.web3.chainId
      }
    },
    isNetworkOnlyOne() {
      return this.$store.state.modal.params.itemCount === 1
    },
    unsupported() {
      return 'unsupported' in this.$store.state.modal.params
        ? this.$store.state.modal.params.unsupported
        : false
    },
    required() {
      return 'hideCloseButton' in this.$store.state.modal.params
        ? this.$store.state.modal.params.hideCloseButton
        : false
    }
  },
  methods: {
    hideModal() {
      this.$store.dispatch('modal/hide')
    },
    switchNetwork(chainId) {
      if (chainId == 0) {
        this.$store.dispatch('web3/updateShowAllChain', true)
        this.hideModal()
      } else 
        this.$web3
          .switchChain(this.$store.state.web3.instance, chainId)
          .then(() => {
            this.$store.dispatch('web3/updateShowAllChain', false)
            this.$store.dispatch('web3/updateChainId', chainId)
            this.hideModal()
          })
          .catch((error) => {
            console.log(error)
            if (!('code' in error)) return
            let errorCode = error.code
            // @TODO I'd like to do something about this lame condition determination(saito)
            if (
              error.data &&
              error.data.originalError &&
              error.data.originalError.code
            ) {
              errorCode = error.data.originalError.code
            }
            if (errorCode === 4902) {
              this.showAddChainModal(chainId)
            }
          })
    },
    showAddChainModal(chainId) {
      this.$store.dispatch('modal/show', {
        target: 'add-chain-modal',
        size: 'small',
        params: {
          chainId: chainId,
          hideCloseButton: false,
          lastModalTarget: 'network-modal',
          lastModalSize: this.$store.state.modal.size,
          lastModalParams: {
            unsupported: this.$store.state.modal.params.unsupported,
            hideCloseButton: this.$store.state.modal.params.hideCloseButton,
            itemCount: this.$store.state.modal.params.itemCount
          }
        }
      })
    }
  },
  created() {
    this.networks = Object.values(AvailableNetworks).filter(
      (network) =>
        this.paymentAvailableNetworks.includes(network.chainId) &&
        this.chainId != network.chainId
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/style.scss';
@import '@/assets/scss/delaunay.scss';
</style>
