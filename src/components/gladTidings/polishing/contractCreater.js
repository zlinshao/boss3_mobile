let url = globalConfig.e_server;
import Vue from 'vue';
import {Toast} from 'vant'

let getNumber = function (type, city_id = '', success, error) {
  let version = type === 1 ? '1.1' : '1.2';
  Vue.prototype.$http.post(url + 'fdd/number/take', {
    version: version,
    city_id: city_id,
    ticket: '',
    uid: '',
  }).then((res) => {
    if (res.data.code === '20000') {
      success(res.data.data.number);
    } else {
      error(res.data.msg);
    }
  })
};
let cancelContract = function (number, success, error) {
  Vue.prototype.$http.get(url + 'fdd/contract/cancel/' + number).then((res) => {
    if (res.data.code === '40002' || res.data.code === '40000') {
      success();
    } else {
      error(res.data.msg);
    }
  })
};

function createContract(pdf, param, success, error) {
  if (param.province === '') {
    error('请先选择房屋地址');
    return
  }
  Vue.prototype.$http.post(url + 'fdd/contract/view', param).then((res) => {
    Toast.clear();
    if (res.data.code === '40000') {
      pdf.show(url + res.data.data, 1);
    } else {
      error(res.data.msg);
    }
  }).catch(e => {
    Toast.clear();
  })
}

function trueName(item, success, error) {
  Vue.prototype.$http.get(url + '/fdd/customer/verified?idcard=' + item.idcard + '&name=' + item.name + '&phone=' + item.phone).then(res => {
    if (res.data.code === '40000') {
      item.fadada_user_id = res.data.data.customer_id;
      console.log(item.fadada_user_id+'1111')
      Toast.clear();
    } else {
      Vue.prototype.$http.post(url + 'fdd/customer/cert', {
        customer_name: item.name,
        idcard: item.idcard,
        mobile: item.phone
      }).then(res => {
        Toast.clear();
        if (res.data.code === '40010') {
          success(res.data.data.data);
        } else {
          error(res.data.msg);
        }
      }).catch(e=>{
        Toast.clear();
        error('网络错误');
      })
    }
  }).catch(e=>{
    Toast.clear();
    error('网络错误');
  });
}

function copy(oldObj, source, split) {
  let data = {};
  for (let item in oldObj) {
    if (split.indexOf(item) !== -1) {
      data[item] = '';
      continue
    }
    if (source[item] instanceof Array) {
      data[item] = copyArray(source[item])
    } else if (typeof source[item] === 'object') {
      data[item] = copyChild(source[item])
    } else {
      data[item] = source[item];
    }
  }
  return data;
}

function copyArray(source) {
  let list = [];
  for (let i = 0; i < source.length; i++) {
    let entity = source[i];
    list.push(entity)
  }
  return list;
}

function copyChild(source) {
  let data = {};
  for (let item in source) {
    if (typeof source[item] === 'object') {
      data[item] = copyChild(source[item])
    } else {
      data[item] = source[item];
    }
  }
  return data;
}


export {createContract, getNumber, cancelContract, trueName, copy}
