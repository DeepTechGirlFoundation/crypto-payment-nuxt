<template>
  <div v-if="!isFixedSymbol" class="DASHBOARD-one">
    <div class="title-gradation">
      Welcome to Slash Payment
    </div>
    <p class="welcome-desc">
      Slash Payment is the easiest and most secure way to accept crypto payments for your service or store.
    </p>
    <div class="title-gradation">
      Step 1
    </div>
    <p class="welcome-desc">
      First of all, please select the token we support that you want to receive as sales.
      <br>
      *The token you set here cannot be changed later. If you want to change the token, you will need to connect with a new Web3 address.
    </p>
    <div class="title">
      Select ReceiveToken
    </div>
    <div class="welcome-receice_contents">
      <div class="welcome-receice_tokens add-flex ">
        <div class="welcome-receice_token one" @click="selectToken(symbols.usdt)" :class="{ active: isTokenSelected(symbols.usdt) }">
          <figure>
            <img src="@/assets/images/icon/usdt-l.svg">
          </figure>
          <p class="welcome-receice_name">
            USDT
            <br>
            USD-peg
          </p>
          <div class="welcome-receice_box gradation-orange">
            Recommend
          </div>
        </div>
        <div class="welcome-receice_token two" @click="selectToken(symbols.usdc)" :class="{ active: isTokenSelected(symbols.usdc) }">
          <figure>
            <img src="@/assets/images/icon/usdc-l.svg">
          </figure>
          <p class="welcome-receice_name">
            USDC
            <br>
            USD-peg
          </p>
          <div class="welcome-receice_box gradation-dark">
            better
          </div>
        </div>
        <div class="welcome-receice_token tree" @click="selectToken(symbols.dai)" :class="{ active: isTokenSelected(symbols.dai) }">
          <figure>
            <img src="@/assets/images/icon/dai-l.svg">
          </figure>
          <p class="welcome-receice_name">
            DAI
            <br>
            USD-peg
          </p>
          <div class="welcome-receice_box gradation-dark">
            better
          </div>
        </div>
        <div class="welcome-receice_token four" @click="selectToken(symbols.jpyc)" :class="{ active: isTokenSelected(symbols.jpyc) }">
          <figure>
            <img src="@/assets/images/icon/jpyc-l.svg">
          </figure>
          <p class="welcome-receice_name">
            JPYC v2
            <br>
            JPY-peg
          </p>
          <div class="welcome-receice_box gradation-gray">
            beta ver.
          </div>
        </div>
        <div class="welcome-receice_token five" @click="selectToken(symbols.weth)" :class="{ active: isTokenSelected(symbols.weth) }">
          <figure>
            <img src="@/assets/images/icon/eth.svg">
          </figure>
          <p class="welcome-receice_name">
            WETH
            <br>
            WETH
          </p>
          <div class="welcome-receice_box gradation-gray">
            beta ver.
          </div>
        </div>
      </div>
      <div v-if="nativeTokensAllowed">
        <p class="mb-2">Native Tokens</p>
        <div class="welcome-receice_tokens add-flex ">
          <div class="welcome-receice_token one" @click="selectToken(symbols.eth)" :class="{ active: isTokenSelected(symbols.eth) }">
            <figure>
              <img src="@/assets/images/symbol/eth.svg">
            </figure>
            <p class="welcome-receice_name">
              ETH
              <br>
              ETH-native token
            </p>
            <div class="welcome-receice_box gradation-gray">
              beta ver.
            </div>
          </div>
          <div class="welcome-receice_token one" @click="selectToken(symbols.bnb)" :class="{ active: isTokenSelected(symbols.bnb) }">
            <figure>
              <img src="@/assets/images/symbol/bnb.svg">
            </figure>
            <p class="welcome-receice_name">
              BNB
              <br>
              BNB-native token
            </p>
            <div class="welcome-receice_box gradation-gray">
              beta ver.
            </div>
          </div>
          <div class="welcome-receice_token two" @click="selectToken(symbols.matic)" :class="{ active: isTokenSelected(symbols.matic) }">
            <figure>
              <img src="@/assets/images/symbol/matic.svg">
            </figure>
            <p class="welcome-receice_name">
              MATIC
              <br>
              MATIC-native token
            </p>
            <div class="welcome-receice_box gradation-gray">
              beta ver.
            </div>
          </div>
          <div class="welcome-receice_token tree" @click="selectToken(symbols.avax)" :class="{ active: isTokenSelected(symbols.avax) }">
            <figure>
              <img src="@/assets/images/symbol/avax.svg">
            </figure>
            <p class="welcome-receice_name">
              AVAX
              <br>
              AVAX-native token
            </p>
            <div class="welcome-receice_box gradation-gray">
              beta ver.
            </div>
          </div>
          <div class="welcome-receice_token tree" @click="selectToken(symbols.doge)" :class="{ active: isTokenSelected(symbols.doge) }">
            <figure>
              <img src="@/assets/images/symbol/wdoge.svg">
            </figure>
            <p class="welcome-receice_name">
              wrapped DOGE
              <br>
              DogeChain-native token
            </p>
            <div class="welcome-receice_box gradation-gray">
              beta ver.
            </div>
          </div>
          <div class="welcome-receice_token tree" @click="selectToken(symbols.astr)"
            :class="{ active: isTokenSelected(symbols.astr) }">
            <figure>
              <img src="@/assets/images/symbol/astr.svg">
            </figure>
            <p class="welcome-receice_name">
              ASTR
              <br>
              ASTAR-native token
            </p>
            <div class="welcome-receice_box gradation-gray">
              beta ver.
            </div>
          </div>
        </div>
      </div>
      <button @click="showConfirmModal" class="welcome-receice_btn">
        Confirm
      </button>
    </div>
  </div>
  <div v-else class="DASHBOARD-two">
    <div class="title-gradation">
      Welcome to Slash Payment
    </div>
    <p class="welcome-desc">
      Slash Payment is the easiest and most secure way to accept crypto payments for your service or store.
    </p>
    <div class="title-gradation">
      Step 2
    </div>
    <p class="welcome-desc">
      Create merchant-specific contracts on a per-network basis.
      <br>
      *Required for each network that accepts payments.
    </p>
    <div class="welcome-image">
      <figure>
        <img src="@/assets/images/setting-image.svg">
      </figure>
      <div class="welcome-receice_contents auto">
        <router-link
          to="/admin/payment/settings/contract"
          tag="button"
          class="welcome-receice_btn"
        >
          Go Settings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      symbol: 'USDT',
      symbols: {
        usdt: 'USDT',
        usdc: 'USDC',
        jpyc: 'JPYC',
        dai: 'DAI',
        weth: 'WETH',
        eth: 'ETH',
        bnb: 'BNB',
        avax: 'AVAX',
        matic: 'MATIC',
        doge: 'DOGE',
        astr: 'ASTR',
      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL
    },
    isFixedSymbol() {
      return this.$store.state.account.receiveSymbol
    },
    isTokenSelected() {
      return (selectedSymbol) => {
        return this.symbol === selectedSymbol
      }
    },
    nativeTokensAllowed() {
      return 'allow_native_token' in this.$route.query
    }
  },
  methods: {
    selectToken(selectedSymbol) {
      this.symbol = selectedSymbol
    },
    showConfirmModal() {
      this.$store.dispatch('modal/show', {
        target: 'receive-modal',
        size: 'small',
        params: {
          symbol: this.symbol
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/*
TODO:
To apply the new UI on the Admin side,
change the style.scss to import style.scss directly under the scss directory.
*/
@import '@/assets/scss/old/style.scss';

.title-gradation{
  background: $gradation-light;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 150% 150%;
  font-weight: 600;
  display: inline-block;
  font-size: 24px;
  margin-bottom: 8px;
}

.welcome-desc{
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 44px;
}

.welcome-image{
  width: fit-content;
  @include media(sp) {
    width: 80%;
    margin: auto;
  }
  figure{
    width: 500px;
    margin-bottom: 48px;
    @include media(sp) {
      width: 300px;
    }
  }
}

.title{
  margin-bottom: 24px;
  h3{
    font-size: 20px;
    font-weight: 400;
  }
}

.welcome-receice_contents{
  text-align: center;
  width: fit-content;
  &.auto{
    margin: auto;
  }
  .welcome-receice_btnwrap{
    margin: auto;
  }
  .welcome-receice_tokens{
    justify-content: left;
    margin-bottom: 48px;
    @include media(sp) {
      justify-content: space-evenly;
    }
    .one, .two, .tree, .four, .five{
      text-align: center;
      padding: 8px 16px;
      border-radius: 10px;
      width: 120px;
      background: #292536;
      cursor: pointer;
      margin: 0 16px 0 0;
      @include media(sp) {
        margin-bottom: 16px;
      }
      figure{
        margin: 0 auto 10px;
        width: 70px;
        img {
          width: 100%;
        }
      }
      &.active{
        background: #4E455A;
        border: 1px solid #fff;
        padding: 7px 15px;
      }
    }
    @include media(sp) {
      .two{
        margin-right: 0;
      }
    }
    .five{
      margin-right: 0;
    }
    .welcome-receice_name{
      font-size: 14px;
      margin-bottom: 10px;
    }
    .welcome-receice_box{
      font-size: 10px;
      font-weight: 300;
      padding: 8px 10px;
      &.gradation-orange{
        background: $gradation-orange;
      }
      &.gradation-dark{
        background: $gradation;
      }
      &.gradation-gray{
        background: #5D5D5D;
      }
    }
  }
  .welcome-receice_btn{
    background: $gradation-light;
    display: inline-block;
    text-align: center;
    font-size: 14px;
    width: 260px;
    height: 54px;
    line-height: 54px;
    border-radius: 8px;
    cursor: pointer;
  }
}


</style>