let url = globalConfig.e_server;
import Vue from 'vue';

let getNumber=function (type,city_id,success,error) {
  let version=type===1?'1.1':'1.2';
  Vue.prototype.$http.post(url + 'fdd/number/take', {
    version: version,
    city_id: city_id,
    ticket: '',
    uid: '',
  }).then((res) => {
    if (res.data.code === '20000') {
      success(res.data.data.number);
    }else{
      error(res.data.msg);
    }
  })
};
let cancelContract=function (number,success,error) {
  Vue.prototype.$http.get(url + 'fdd/contract/cancel/'+number).then((res) => {
    if (res.data.code === '40002'||res.data.code==='40000') {
      success();
    }else{
      error(res.data.msg);
    }
  })
};

function createCollectContract(pdf, param,success,error) {
  console.log(param)
  Vue.prototype.$http.post(url + 'fdd/contract/view', param).then((res) => {
    if (res.data.code === '40000') {
      pdf.show(res.data.data.download_url.split('8443')[1], 1);
    }else{
      error(res.data.msg);
    }
  })
}

function createRentContract(pdf, param,success,error) {
  console.log(param)
  Vue.prototype.$http.post(url + 'fdd/contract/view', param).then((res) => {
    if (res.data.code === '40000') {
      pdf.show(res.data.data.download_url.split('8443')[1], 1);
    }else{
      error(res.data.msg);
    }
  })
}

export  {createCollectContract, createRentContract,getNumber,cancelContract}
