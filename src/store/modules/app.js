const app = {
    state: {
      personal: [],//个人信息
      bank_card: [],//收款帐户
      allDict: {},
      dictData: {},
      dictDataChild: {},
      searchDetail: {},
    },
    // 计算属性
    getters: {},
    // 声明函数
    mutations: {
      // 房屋选择结果
      SEARCH_DETAIL(state, view) {
        state.searchDetail = view;
      },
      // 收款帐户
      BANK_CARD(state, view) {
        state.bank_card = view;
      },
      // 字典
      GET_DICT(state, view) {
        let obj = {};
        let objChild = {};
        for (let item of view.list) {
          obj[item.id] = item.dictionary_name;
          state.allDict[item.id] = item.dictionary_name;
          if (item.variable) {
            objChild[item.variable.city_id] = item.dictionary_name;
            state.allDict[item.variable.city_id] = item.dictionary_name;
          }
        }
        state.dictData[view.num] = obj;
        state.dictDataChild[view.num] = objChild;
      },
    },
    // 代理执行
    actions: {
      // 房屋选择结果
      getSearchDetail({commit}, view) {
        commit('SEARCH_DETAIL', view);
      },
      // 收款帐户
      getBankCard({commit}, view) {
        commit('BANK_CARD', view);
      },
      // 字典
      getDict({commit}, view) {
        commit('GET_DICT', view);
      },
    }
  };
  export default app
  