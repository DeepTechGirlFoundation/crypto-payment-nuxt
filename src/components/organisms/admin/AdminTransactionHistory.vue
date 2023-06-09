<template>
  <div>
    <div>
      <div class="manage-content">
        <div class="search-wrap add-flex j-between">
          <div class="select-id">
            <select v-model="searchParams.variable.key">
              <option value="transaction_address">Transaction ID</option>
              <option value="order_code">Order ID</option>
            </select>
            <input type="text" v-model="searchParams.variable.value">
          </div>
          <div class="select-status add-flex">
            <div class="select-status_title">
              Status
            </div>
            <select v-model="searchParams.status.value">
              <option value="0">All</option>
              <option value="1">System Received</option>
              <option value="5">Wallet Confirming</option>
              <option value="2">Result Pending</option>
              <option value="3">Cancelled</option>
              <option value="4">Completed</option>
            </select>
          </div>
          <div class="select-date-wrap add-flex">
            <div class="select-date">
              <DatetimePicker
                v-model="searchParams.datetimeFrom.value"
                :id="'from'"
                :locale="'en'"
                :first-day-of-week="1"
                :format="'YYYY-MM-DD HH:mm:00'"
                :formatted="'DD/MM/YYYY HH:mm'"
                :label="'from'"
                :no-label="true"
                :no-header="true"
                :dark="true"
              ></DatetimePicker>
            </div>
            <div class="select-date">
              <DatetimePicker
                v-model="searchParams.datetimeTo.value"
                :id="'to'"
                :locale="'en'"
                :first-day-of-week="1"
                :format="'YYYY-MM-DD HH:mm:59'"
                :formatted="'DD/MM/YYYY HH:mm'"
                :label="'to'"
                :no-label="true"
                :no-header="true"
                :dark="true"
                :right="true"
              ></DatetimePicker>
            </div>
          </div>
          <div class="search-btn" @click="searchHistory()">
            Search
          </div>
        </div>
        <div class="manage-function add-flex a-center">
          <div class="manage-show add-flex a-center">
            <div class="manage-show-title">
              show
            </div>
            <div class="show-select">
              <select v-model="paginateParams.perPage.value" @change="searchHistory()">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div class="manage-show-unit">
              entries
            </div>
          </div>
          <div class="manage-csv" @click="downloadCsv">
            CSV
          </div>
        </div>
        <div class="manage-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Payment Token</th>
                <th>Order ID</th>
                <th>Time</th>
                <th>Transaction ID</th>
                <th>Network</th>
                <th>Transaction Amount</th>
                <th>Merchant Cancelled</th>
              </tr>
            </thead>
            <tbody v-if="summaries.records.length">
              <tr
                v-for="(record, index) in summaries.records"
                :key="index"
              >
                <td>
                  <div v-if="record.status === 1" class="received">
                    System Received
                  </div>
                  <div v-if="record.status === 2" class="pending">
                    Result Pending
                  </div>
                  <div v-if="record.status === 5" class="wallet-confirming">
                    Wallet Confirming
                  </div>
                  <div v-if="record.status === 3" class="cancelled">
                    Cancelled
                  </div>
                  <div v-if="record.status === 4" class="completed">
                    Completed
                  </div>
                </td>
                <td>
                  {{ record.payment_token }}
                </td>
                <td v-html="wrapOrderCode(record.order_code)">
                </td>
                <td>
                  {{ record.updated_at }}
                </td>
                <td class="center">
                  <a class="link"
                    :href="scanSiteUrl(record.network_type, record.transaction_address)"
                    v-html="wrapScanSiteUrl(record.transaction_address)"
                    target="_blank"
                  ></a>
                </td>
                <td class="center">
                  {{ network(record.network_type) }}
                </td>
                <td class="center">
                  {{ record.base_amount | formatAmount }} {{ record.base_symbol }}
                </td>
                <td class="center">
                  {{ record.is_cancelled ? "Yes" : "No" }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination add-flex j-between a-center">
            <div class="page-count">
              Showing {{ summaries.fromItemNumber }} to {{ summaries.toItemNumber }} of {{ summaries.total }} entries
            </div>
            <div>
                <Paginate
                  :page-count="summaries.lastPageNumber"
                  :page-range="3"
                  :margin-pages="1"
                  :click-handler="searchHistory"
                  :prev-text="'Previous'"
                  :next-text="'Next'"
                  :container-class="'pagenation-wrap'"
                  :prev-class="'prev-item'"
                  :page-class="'p-num'"
                  :next-class="'next-item'"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/../node_modules/vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import DatetimePicker from 'vue-ctk-date-time-picker'
import Paginate from 'vuejs-paginate'
import { NETWORKS, HTTP_CODES, LOGIN_TOKEN } from '@/constants'
import { errorCodeList } from '@/enum/error_code'
import RequestUtility from '@/utils/request'
import moment from 'moment'
import { saveAs } from 'file-saver';
import Decimal from 'decimal.js'

export default {
  name: 'AdminTransactionHistory',
  components: {
    DatetimePicker,
    Paginate
  },
  data() {
    return {
      csvParams: {},
      searchParams: {
        variable: { key: 'transaction_address', value: null },
        status: { key: 'status', value: '0'},
        datetimeFrom: { key: 'updated_at_from', value: null },
        datetimeTo: { key: 'updated_at_to', value: null },
        sortKey: { key: 'sort_key', value: null },
        sortType: { key: 'sort_value', value: null }
      },
      paginateParams: {
        perPage: { key: 'per_page', value: '10' },
        currentPage: { key: 'current_page', value: '1' },
      },
      summaries: {
        lastPageNumber: 0,
        fromItemNumber: null,
        toItemNumber: null,
        total: null,
        records: []
      }
    }
  },
  filters: {
    formatAmount(amount) {
      if (!amount) {
        return '0'
      }
      return Decimal(amount).toString()
    }
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL
    },
    network() {
      return (chainId) => {
        return chainId ? NETWORKS[chainId].symbol : ''
      }
    },
    scanSiteUrl() {
      return (chainId, transactionHash) => {
        if (chainId && transactionHash) {
          return `${NETWORKS[chainId].scanUrl}/tx/${transactionHash}`
        } else {
          return ''
        }
      }
    },
    wrapScanSiteUrl() {
      return (transactionHash) => {
        let url = ''
        if (transactionHash) {
          url = '...' + transactionHash.slice(-5)
        }
        return url
      }    
    },
    wrapOrderCode() {
      return (orderCode) => {
        return orderCode.replace(/.{16}/g, "$&" + "<br>")
      }
    }
  },
  methods: {
    apiGetHistory() {
      const url = `${this.baseUrl}/api/v1/management/transaction/normal`
      const inputedParams = Object.entries(this.searchParams).map(([key, param]) => {
          if (
            (param.key !== 'status' && param.value) ||
            (param.key === 'status' && param.value !== '0')
          ) {
            const value = key === 'datetimeFrom' || key === 'datetimeTo'
              ? String(moment(param.value).unix())
              : param.value
            this.csvParams[param.key] = value
            return [ param.key, value ]
          }
        }).filter(param => param)
      const controlParams = Object.values(this.paginateParams).map((param) => {
        return [ param.key, param.value ]
      })
      const timezoneParam = [[ 'offset', moment().utcOffset() ]]
      const convertedParams = new URLSearchParams(inputedParams.concat(controlParams, timezoneParam))
      const request = {
        headers: { Authorization: RequestUtility.getBearer() },
        params: convertedParams
      }
      return this.axios.get(url, request)
    },
    apiGetHistoryCsv() {
      const url = `${this.baseUrl}/api/v1/management/transaction/normal/csv`
      const searchParams = Object.entries(this.csvParams).map(([key, value]) =>  {
        return [ key, value ]
      })
      const timezoneParam = [[ 'offset', moment().utcOffset() ]]
      const convertedParams = new URLSearchParams(searchParams.concat(timezoneParam))
      const request = {
        headers: { Authorization: RequestUtility.getBearer() },
        params: convertedParams
      }
      return this.axios.get(url, request)
    },
    searchHistory(page = 1) {
      this.paginateParams.currentPage.value = page
      this.apiGetHistory().then((response) => {
        this.summaries.records = response.data.data
        this.summaries.total = response.data.total
        this.summaries.fromItemNumber = response.data.from
        this.summaries.toItemNumber = response.data.to
        this.summaries.lastPageNumber = response.data.last_page
      }).catch((error) => {
        if (error.response.status !== HTTP_CODES.UN_AUTHORIZED) {
          const message = 'errors' in error.response.data
            ? errorCodeList[error.response.data.errors.shift()].msg
            : 'Please try again.'
          this.$store.dispatch('modal/show', {
            target: 'error-for-admin-modal',
            size: 'small',
            params: {
              message: message
            }
          })
        } else {
          localStorage.removeItem(LOGIN_TOKEN)
          this.$router.push({ path: '/admin' })
        }
      })
    },
    downloadCsv() {
      this.apiGetHistoryCsv().then((response) => {
        const fileName = 'history_' + moment().format('DDMMYYYYhhmm') + '.csv'
        const blob = new Blob([ response.data ], { type: 'text/csv;charset=utf8' })
        saveAs(blob, fileName)
      }).catch((error) => {
        if (error.response.status !== HTTP_CODES.UN_AUTHORIZED) {
          const message = 'errors' in error.response.data
            ? errorCodeList[error.response.data.errors.shift()].msg
            : 'Please try again.'
          this.$store.dispatch('modal/show', {
            target: 'error-for-admin-modal',
            size: 'small',
            params: {
              message: message
            }
          })
        } else {
          localStorage.removeItem(LOGIN_TOKEN)
          this.$router.push({ path: '/admin' })
        }
      })
    },
  },
  created() {
    this.searchHistory()
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

.search-wrap{
  margin-bottom: 32px;
  .select-id{
    width: 28%;
    border: 1px solid #78668D;
    position: relative;
    border-radius: 8px;
    @include media(sp) {
      width: 100%;
      margin-bottom: 16px;
    }
    &::after{
      position: absolute;
      right: 50%;
      transform: translate(-50%,0);
      content: "";
      height: 35px;
      width: 1px;
      background: #78668D;
    }
    &::before{
      position: absolute;
      content: "";
      background: url(/assets/images/down-arrow.svg) no-repeat center center;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 45%;
      transform: translate(-50%, -50%);
      z-index: 0;
    }
    select, input{
      width: 50%;
      font-size: 13px;
      line-height: 32px;
      font-weight: 100;
    }
    input{
      text-align: right;
      padding:0 4px;
    }
    select{
      padding: 0 8px;
    }
  }
  .select-status{
    width: 20%;
    border: 1px solid #78668D;
    position: relative;
    border-radius: 8px;
    @include media(sp) {
      width: 100%;
      margin-bottom: 16px;
    }
    &::after{
      position: absolute;
      right: 70%;
      transform: translate(-50%,0);
      content: "";
      height: 35px;
      width: 1px;
      background: #78668D;
      @include media(sp) {
        right: 50%;
      }
    }
    &::before{
      position: absolute;
      content: "";
      background: url(/assets/images/down-arrow.svg) no-repeat center center;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 95%;
      transform: translate(-50%, -50%);
      z-index: 0;
    }
    &_title{
      width: 30%;
      font-size: 13px;
      line-height: 32px;
      font-weight: 100;
      padding: 0 8px;
      @include media(sp) {
        width: 50%;
      }
    }
    select{
      width: 70%;
      font-size: 13px;
      line-height: 32px;
      font-weight: 100;
      padding: 0 8px;
      @include media(sp) {
        width: 50%;
      }
    }
  }
  .select-date-wrap{
    width: 35%;
    position: relative;
    @include media(sp) {
      width: 100%;
      margin-bottom: 16px;
    }
    &::after{
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 2px;
      background: #fff;
    }
  }
  .select-date{
    width: 46%;
    border: 1px solid #78668D;
    position: relative;
    border-radius: 8px;
    &:nth-child(1){
      margin-right: 8%;
    }
    &::before{
      position: absolute;
      content: "";
      background: url(/assets/images/calender.svg) no-repeat center center;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 8px;
      transform: translate(0%, -50%);
      z-index: 1;
    }
  }
  .search-btn{
    font-weight: 200;
    font-size: 14px;
    line-height: 32px;
    background: $gradation-light;
    padding: 2px 12px;
    border-radius: 8px;
    cursor: pointer;
    @include media(sp) {
      width: 100%;
      text-align: center;
    }
    &:hover{
      opacity: .8;
    }
  }
}

.select-date::v-deep {
  .date-time-picker {
    $base-bg-color: #161421;
    $base-font-color: #FFFFFF;
    .field-input {
      height: 35px;
      min-height: 30px;
      padding-left: 32px;
      padding-right: 0px;
      background: $base-bg-color;
      border: none !important;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: $base-font-color;
    }
    .field-clear-button {
      right: 3px;
    }
    .datepicker {
      margin-top: 4px;
    }
  }
}

.manage-function{
  margin-bottom: 32px;
  .manage-show{
    &-title,&-unit{
      font-size: 14px;
      font-weight: 200;
    }
    .show-select{
      position: relative;
      width: 50px;
      margin: 0 8px;
      &::before{
        position: absolute;
        content: "";
        background: url(/assets/images/down-arrow.svg) no-repeat center center;
        width: 20px;
        height: 20px;
        top: 50%;
        right: 5%;
        transform: translate(0, -50%);
        z-index: 0;
      }
    }
    select{
      font-size: 14px;
      font-weight: 200;
      width: 50px;
      border: 1px solid #78668D;
      position: relative;
      border-radius: 8px;
      padding: 8px;
    }
  }
  .manage-csv{
    width: 80px;
    text-align: center;
    padding: 8px;
    background: #58466E;
    font-weight: 200;
    font-size: 15px;
    border-radius: 8px;
    margin-left: 16px;
    cursor: pointer;
    &:hover{
      opacity: .8;
    }
  }
}

.manage-table{
  position: absolute;
  z-index: 10;
  width: calc(100% - 228px);
  @include media(sp) {
    width: 100%;
    overflow: hidden;
  }
  table{
    width: calc(100% - 40px);
    border-collapse: collapse;
    margin-bottom: 32px;
    display: block;
    overflow-x: auto;
    height: 50vh;
    &::-webkit-scrollbar{
      display: none;
    }
    @include media(sp) {
      width: 100%;
      overflow-x: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;
      margin-bottom: 0;
    }
    .link {
      color: #5390f2;
    }
    .center {
      text-align: center;
    }
    thead,tbody{
      width: 100%;
      tr{
        border-bottom: 2px solid #58466E;
        th{
          font-size: 16px;
          text-align: left;
          padding-bottom: 8px;
        }
        td{
          font-size: 14px;
          padding: 16px 0;
          div{
            text-align: center;
            border-radius: 8px;
            width: 160px;
            span{
              font-size: 12px;
            }
          }
          .received{
            border: 1px solid #C0C0C0;
            color: #C0C0C0;
            padding: 16px 16px;
          }
          .wallet-confirming{
            border: 1px solid #ee07ff;
            color: #ee07ff;
            padding: 16px 16px;
          }
          .pending{
            border: 1px solid #FFC107;
            color: #FFC107;
            padding: 16px 16px;
          }
          .cancelled{
            border: 1px solid #F75D68;
            color: #F75D68;
            padding: 16px 16px;
          }
          .completed{
            border: 1px solid #00FF3B;
            color: #00FF3B;
            padding: 16px 16px;
          }
        }
        th,td{
          overflow-wrap: break-word;
          font-weight: 100;
          &:nth-child(1){
            width: 18vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(2){
            width: 20vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(3){
            width: 15vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(4){
            width: 12vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(5){
            width: 12vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(6){
            width: 10vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(7){
            width: 10vw;
            @include media(sp) {
              width:200px;
            }
          }
          &:nth-child(8){
            width: 4.22vw;
            @include media(sp) {
              width:200px;
            }
          }
        }
      }
    }
  }
}

.pagination{
  margin-bottom: 32px;
  width: calc(100% - 40px);
  .page-count{
    font-size: 16px;
    font-weight: 300;
  }
  .pagenation-wrap{
    font-weight: 300;
    font-size: 16px;
  }
}
</style>

<style lang="scss">
.prev-item {
  font-size: 16px;
  margin: 0 8px;
  display: inline;
}

.next-item {
  font-size: 16px;
  margin: 0 8px;
  display: inline;
}

.p-num{
  padding: 8px;
  font-size: 13px;
  border-radius: 8px;
  display: inline;
  cursor: pointer;
  &.active{
    background: #4E455A;
  }
}
</style>