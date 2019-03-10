let url = globalConfig.e_server;
import Vue from 'vue';

let getNumber = function (type, city_id, success, error) {
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

function createCollectContract(pdf, param, success, error) {
  console.log(param)
  Vue.prototype.$http.post(url + 'fdd/contract/view', param).then((res) => {
    if (res.data.code === '40000') {
      pdf.show(res.data.data.download_url.split('8443')[1], 1);
    } else {
      error(res.data.msg);
    }
  })
}

function createRentContract(pdf, param, success, error) {
  console.log(param)
  Vue.prototype.$http.post(url + 'fdd/contract/view', param).then((res) => {
    if (res.data.code === '40000') {
      pdf.show(res.data.data.download_url.split('8443')[1], 1);
    } else {
      error(res.data.msg);
    }
  })
}

function trueName(item, error, vue) {
  Vue.prototype.$http.get(url + '/fdd/customer/verified?idcard=' + item.idcard + '&name=' + item.name + '&phone=' + item.phone).then(success => {
    if (success.data.code === '40000') {
      item.fadada_user_id = success.data.data.customer_id;
    } else {
      Vue.prototype.$http.post(url + 'fdd/customer/cert', {
        customer_name: item.name,
        idcard: item.idcard,
        mobile: item.phone
      }).then(success => {
        if (success.data.code === '40010') {
          window.open(success.data.data.data);
        } else {
          error(success.data.msg);
        }
      })
    }
  });
}

function copy(oldObj, source) {
  let data = {};
  for (let item in oldObj) {
    if (source[item] instanceof Array) {
      data[item]=copyArray(source[item])
    } else if (typeof source[item] === 'object') {
      data[item] = copyChild(source[item])
    } else {
      data[item] = source[item];
    }
  }
  return data;
}
function copyArray(source) {
  let list=[];
  for(let i=0;i<source.length;i++){
    let entity=source[i];
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


export {createCollectContract, createRentContract, getNumber, cancelContract, trueName, copy}
