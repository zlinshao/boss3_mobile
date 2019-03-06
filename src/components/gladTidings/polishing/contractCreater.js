let url = "http://192.168.20.27/ewal_contract/public/";
import Vue from 'vue';

let getNumber=function (success,error) {
  Vue.prototype.$http.post(url + 'fdd/number/take', {
    version: '1.1',
    city_code: '01',
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

function createCollectContract(pdf, param,error) {
  console.log(param)
  Vue.prototype.$http.post(url + 'fdd/contract/view', param).then((res) => {
    if (res.data.code === '40000') {
      pdf.show(res.data.data.download_url.split('8443')[1], 1);
    }else{
      error(res.data.data.msg);
    }
  })
}

function createRentContract() {

}

export  {createCollectContract, createRentContract,getNumber,cancelContract}
