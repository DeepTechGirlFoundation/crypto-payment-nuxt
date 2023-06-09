<template>
  <div :class="classes">
    <div class="header">
      <h3 class="header__title">
        <img src="@/assets/images/url-refresh.svg" />
        URL Refresh
      </h3>
    </div>
    <div class="body">
      <p class="sub-title">Current URL</p>
      <div class="text-wrap">
        <p>
          {{ url }}
        </p>
        <img class="copy" @click="copy(url)" src="@/assets/images/copy.svg" />
      </div>
      <div class="dsc-wrap">
        <span class="mb-3">
          Would you like to Refresh this URL and QR code?
        </span>
        <span>
          The device currently linked will be logged out and a new linkage will
          be required.
        </span>
      </div>
      <button @click="confirm" class="btn __l add-flex j-center a-center">
        <img src="@/assets/images/url-refresh.svg" />
        <span> Refresh </span>
      </button>
    </div>
    <button class="close" @click="hideModal">
      <img src="@/assets/images/cross.svg" />
      <span> 閉じる </span>
    </button>
  </div>
</template>

<script>
import RequestUtility from "@/utils/request";
import { errorCodeList } from "@/enum/error_code";

export default {
  name: "walletModal",
  data() {
    return {
      url: "",
    };
  },
  computed: {
    classes() {
      return ["modal-box", `--${this.$store.state.modal.size}`];
    },
    deeplinks() {
      return this.$store.state.deeplink.links;
    },
    deeplink() {
      return this.$store.state.modal.params.record;
    },
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL;
    },
  },
  methods: {
    hideModal() {
      this.$store.dispatch("modal/hide");
    },
    copy(value) {
      this.$store.dispatch("account/copied");
      this.$clipboard(value);
    },
    // Refresh this URL and QR code
    confirm() {
      this.apiRefreshMobileToken()
        .then((res) => {
          this.$store.dispatch("deeplink/updateLinks", {
            ...this.deeplinks,
            data: this.deeplinks.data.map((deeplink) => {
              if (deeplink.id === this.deeplink.id) {
                return res.data;
              }
              return deeplink;
            }),
          });
          this.hideModal();
        })
        .catch((error) => {
          let message;
          if (error.response.status === 400) {
            message = errorCodeList[error.response.data.errors.shift()].msg;
          } else {
            message = "Please try again after a while.";
          }
          this.showErrorModal(message);
        });
    },
    apiRefreshMobileToken() {
      const url = `${this.baseUrl}/api/v1/management/authorization-code/${this.deeplink.id}/refreshToken`;
      const options = {
        headers: { Authorization: RequestUtility.getBearer() },
      };

      return this.axios.patch(url, null, options);
    },
    showErrorModal(message) {
      this.$store.dispatch("modal/show", {
        target: "error-for-admin-modal",
        size: "small",
        params: {
          message: message,
        },
      });
    },
  },
  mounted() {
    this.url = `${this.baseUrl}/store_apps/${this.deeplink.code}`;
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";

.modal-box {
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #292536;
  @include media(pc) {
    &.--small {
      width: 470px;
    }
    &.--medium {
      width: 760px;
    }
  }
  @include media(sp) {
    width: calc(100vw - 32px);
  }
}
.header {
  @include media(pc) {
    padding: 24px 24px 0 24px;
    &__title {
      font-size: 2.5rem;
      margin-bottom: 4rem;
      img {
        width: 20px;
      }
    }
    &__desc {
      font-size: 2rem;
    }
  }
  @include media(sp) {
    padding: 18px;
    &__title {
      font-size: 2.3rem;
      img {
        width: 20px;
      }
    }
  }
  &__title {
    font-weight: 500;
    img {
      width: 20px;
      margin-right: 8px;
      vertical-align: baseline;
    }
  }
  &__desc {
    font-weight: 100;
  }
}
.close {
  position: absolute;
  width: 16px;
  height: 16px;
  font-size: 0;

  @include media(pc) {
    top: 30px;
    right: 24px;
  }
  @include media(sp) {
    top: 24px;
    right: 24px;
  }
}
.body {
  @include media(pc) {
    padding: 0 24px 40px;
  }
  @include media(sp) {
    padding: 0 12px 48px;
  }
  .sub-title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .text-wrap {
    padding: 16px;
    background: #171522;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    p {
      width: 70%;
      font-size: 11px;
      word-break: break-word;
    }
  }
  .dsc-wrap {
    margin-bottom: 32px;
    span {
      display: block;
      font-size: 16px;
    }
  }
  .dsc {
    font-size: 12px;
    font-weight: 200;
  }
  .btn {
    width: 70%;
    margin: auto;
    img {
      padding: 0 12px 0 0 !important;
      width: 34px;
    }
  }
}
.footer {
  text-align: center;

  @include media(pc) {
    padding: 0 40px 40px;
  }
  @include media(sp) {
    padding: 0 32px 32px;
  }
}
</style>