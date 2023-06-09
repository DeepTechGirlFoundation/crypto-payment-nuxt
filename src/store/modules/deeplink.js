import moment from "moment";
const store = {
  namespaced: true,
  state: {
    links: {
      current_page: 1,
      data: [],
      from: 1,
      last_page: 1,
      per_page: 10,
      to: 1,
      total: 0
    },
  },
  getters: {
    links(state) {
      return state.links.data.map((link) => {
        return {
          id: link.id,
          linkUrl: `${process.env.VUE_APP_API_BASE_URL}/${link.code}`,
          code: link.code,
          merchantId: link.merchantId,
          status: link.active,
          lastLogin: link.verified_at ? moment(link.verified_at).format("DD/MM/YYYY hh:mm:ss A") : '-',
          note: link.note,
          device: link.device_name ? link.device_name : '-',
        };
      });
    },
  },
  actions: {
    updateLinks({ commit }, payload) {
      commit("updateLinks", payload);
    },
  },
  mutations: {
    updateLinks(state, payload) {
      state.links = payload;
    },
  },
};

export default store;
