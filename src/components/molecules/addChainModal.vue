<template>
  <div>
    <PaymentModal
      title="Add Network"
      text="The following networks you tried to switch to are not registered in your wallet.<br />Do you want to add this network to your wallet?"
    >
      <!-- TODO 確認の仕方 -->
      <!-- <p class="d-todo">{{ $options.name }}</p> -->
      <PaymentAction
        :icon="targetNetwork.iconPath"
        :text="targetNetwork.name"
      />

      <div class="d-btnwrap">
        <PaymentButton
          text=" Yes"
          @click.native="addChain(targetNetwork.chainId)"
        />
        <PaymentButton
          text="No"
          color="cancel"
          @click.native="cancel"
        />
      </div>

      <div class="d-btnwrap bottomCloseBtn">
        <PaymentButton
          color="cancel"
          text="CLOSE"
          icon="dismiss"
          size="s"
          @click.native="hideModal()"
        />
      </div>
    </PaymentModal>
  </div>
</template>

<script>
import { NETWORKS } from "@/constants";
import PaymentModal from "@/components/organisms/Payment/Modal";
import PaymentButton from "@/components/organisms/Payment/Button";
import PaymentAction from "@/components/organisms/Payment/Action";
export default {
  name: "addChainModal",
  components: {
    PaymentButton,
    PaymentModal,
    PaymentAction,
  },
  computed: {
    classes() {
      const classes = ["modal-box", `--${this.$store.state.modal.size}`];
      return classes;
    },
    isHideCloseButton() {
      return this.$store.state.modal.params.hideCloseButton;
    },
    chainId() {
      return this.$store.state.modal.params.chainId;
    },
    targetNetwork() {
      return NETWORKS[this.chainId];
    },
    lastModalTarget() {
      return this.$store.state.modal.params.lastModalTarget;
    },
    lastModalSize() {
      return this.$store.state.modal.params.lastModalSize;
    },
    lastModalParams() {
      return this.$store.state.modal.params.lastModalParams;
    },
  },
  methods: {
    hideModal() {
      this.$store.dispatch("modal/hide");
    },
    addChain() {
      this.$web3
        .addChain(this.$store.state.web3.instance, this.chainId)
        .then(() => {
          this.hideModal();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      if (this.lastModalTarget) {
        this.$store.dispatch("modal/show", {
          target: this.lastModalTarget,
          size: this.lastModalSize,
          params: this.lastModalParams,
        });
      } else {
        this.hideModal();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";
@import "@/assets/scss/delaunay.scss";
@include media(pc) {
  .btn:nth-child(n + 3) {
    margin-top: 25px;
  }
}
@include media(sp) {
  .btn:not(:last-child) {
    margin-bottom: 16px;
  }
}

.modal-box {
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color_bg);
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
    padding: 24px;
    &__title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    &__desc {
      font-size: 2rem;
    }
  }
  @include media(sp) {
    padding: 18px;
    &__title {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    &__desc {
      font-size: 1.5rem;
    }
  }
  &__title {
    font-weight: 500;
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
    padding: 24px 24px 40px;
  }
  @include media(sp) {
    padding: 24px 12px 48px;
    flex-wrap: wrap;
    .btn {
      width: 100% !important;
      &:nth-child(1) {
        margin-bottom: 16px;
      }
    }
  }
  .box {
    background: var(--color_darken);
    color: #fff;
    font-size: 15px;
    padding: 1.4rem 1rem;
    height: 6.6rem;
    line-height: 3.6rem;
    border-radius: 1rem;
    text-align: left;
    width: 100%;
    font-weight: 400;
    margin-bottom: 24px;
    &:nth-child(2) {
      margin-bottom: 0;
    }
    .btn-icon {
      display: inline-block;
      width: 38px;
      height: 38px;
      margin-right: 8px;
      img {
        border-radius: 6px;
      }
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
