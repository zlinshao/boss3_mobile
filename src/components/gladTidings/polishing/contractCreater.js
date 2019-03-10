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
function trueName(item,error) {
  Vue.prototype.$http.get(url+'/fdd/customer/verified?idcard='+item.idcard+'&name='+item.name+'&phone='+item.phone).then(success=>{
    if(success.data.code==='40000'){
      item.fadada_user_id=success.data.data.customer_id;
    }else{
      Vue.prototype.$http.post(url + 'fdd/customer/cert', {
        customer_name: item.name,
        idcard: item.idcard,
        mobile: item.phone
      }).then(success => {
        if (success.data.code === '40010') {
          window.open(success.data.data.data);
          // dd.biz.util.openLink({
          //   url:success.data.data.data,//要打开链接的地址
          //   onSuccess : function(result) {
          //     alert(JSON.stringify(result))
          //   },
          //   onFail : function(err) {
          //     alert(JSON.stringify(err))
          //   }
          // });
        } else {
          error(success.data.msg);
        }
      })
    }
  });
}

export  {createCollectContract, createRentContract,getNumber,cancelContract,trueName}
