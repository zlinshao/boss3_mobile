<template>
  <div id="cardDetail">
    <div class="detail">
      <div class="detailLeft">
        <div @click="approvePersonal(2)">
          <img :src="personal.avatar" v-if="personal.avatar">
          <img src="../../../assets/head.png" v-else>
        </div>
      </div>
      <div class="topRight">
        <div class="personal">
          <p>{{personal.name}}</p>
          <p><span v-for="(key,index) in personal.org" v-if="index === 0">{{key.name}}</span></p>
        </div>

        <div class="placeFinish"
             :class="{'statusSuccess': place.status === 'published', 'statusFail':place.status === 'rejected', 'cancelled':place.status === 'cancelled'}">

          <span class="placeSpan" v-if="placeFalse" @click="approvePersonal(1)">
            <i class="iconfont icon-shenpi1"></i>
            <span>{{place.display_name}}</span>
          </span>
          <span class="placeSpan deal" v-if="placeFalse">
            <i class="iconfont icon-yanqi--"></i>
            <span>{{deal}}</span>
          </span>
        </div>
      </div>
      <div v-if="placeFalse && marking === 1" class="priceRange">本小区价格区间：{{priceRegion}}</div>
    </div>

    <div class="detailRight">
      <!--收房报备-->
      <div class="topTitle">
        <div class="load" v-if="vLoading">
          <van-loading type="spinner" color="black"/>
        </div>
        <p style="text-align: center;color: #9c9c9c;" v-if="!vLoading && message">{{message}}</p>
        <div v-for="(key,index) in formList"
             v-if="printscreen.indexOf(index) === -1">
          <p>{{index}}</p>
          <h1>
            <span v-if="Array.isArray(key)" v-for="(item,idx) in key.length" >
              <span style="display: block;">{{key[idx].msg}}</span>
              <span style="display: block;">{{key[idx].period}}</span>
            </span>
            <span v-if="index === '已收金额和汇款账户' || index === '补交定金和收款方式'" v-for="(item,idx) in key.length">
              <span style="display: block;">{{key[idx]}}</span>
            </span>
            <span v-if="!Array.isArray(key) && index !== '房屋类型'">{{key}}</span>
            <span v-if="!Array.isArray(key) && index === '房屋类型'">
              <span style="display: block;">{{key.name}}</span>
            </span>
          </h1>
        </div>
        <div class="photo" v-else>
          <p>{{index}}</p>
          <h1>
            <span v-for="(pic,num) in key">
              <img v-if="pic.is_video" @click="checkTv(pic.uri)" src="../../../assets/video.jpg">
              <img v-else @click="pics(key, num, pic.is_video)" :src="pic.uri">
            </span>
          </h1>
        </div>
        <!-- <div v-if='showElectronicReceipt'>
          <p>电子收据</p>
          <iframe v-if="sign_pdfUrl_exist"  width="100%" height="300px" :src="sign_pdfUrl_str" type="application/pdf"></iframe >
        </div> -->
      </div>

      <ul
        v-waterfall-lower="loadMore"
        waterfall-disabled="disabled"
        waterfall-offset="300">
        <li class="started">
          <!--评论-->
          <div class="commentArea">
            <div class="headline">评论<span>{{paging}}</span></div>
            <div class="commentAreaMain" v-for="key in commentList">
              <div class="commentTitle">
                <div class="staff">
                  <p>
                    <img :src="key.user.avatar" v-if="key.user.avatar">
                    <img src="../../../assets/head.png" v-else>
                  </p>
                  <div>
                    {{key.user.name}}<span class="a" v-for="(item,index) in key.user.org" v-if="index === 0">-{{item.name}}</span>
                  </div>
                </div>
                <div class="times">
                  {{key.created_at}}
                </div>
              </div>
              <div class="contents">
                {{key.body}}
              </div>
              <div class="pics">
                <div v-for="(pic,num) in key.album">
                  <img v-if="pic.info.ext.indexOf('video') > -1" @click="checkTv(pic.uri)"
                       src="../../../assets/video.jpg">
                  <img v-else @click="pics(key.album, num, pic.info.ext)" :src="pic.uri">
                </div>
              </div>
            </div>
            <div v-if="commentList.length === 0 && disabled" style="text-align: center;padding: .3rem 0 0;">
              暂无评论
            </div>
          </div>
        </li>
      </ul>
      <div class="bottom">
        <span v-show="disabled && commentList.length > 6">我是有底线的</span>
        <van-loading v-show="!disabled" type="spinner" color="black"/>
      </div>

    </div>
    <div class="footer">
      <div @click="newly()"
           v-if="personalId.id === personal.id && (placeStatus.indexOf(place.status) > -1)">
        重新提交
      </div>
      <div v-for="(key,index) in operation" @click="commentOn(index, marking)">{{key}}</div>
    </div>

    <div id="videoId" v-show="videoSrc !== ''">
      <video id="video" :src="videoSrc" muted controls autoplay width="90%" height="88%"></video>
      <p class="close" @click="checkTv('')"><i class="iconfont icon-cuowutishi"></i></p>
    </div>

    <div class="bigPhotos" v-if="bigPicShow">
      <div>
        <p v-if="photo.length > 1" class="nextPic" @click="next(photo)"><i class="iconfont icon-xiayibu"></i></p>
        <p v-if="photo.length > 1" class="prePic" @click="pre(photo)"><i class="iconfont icon-xiayibu"></i></p>
        <p class="close" @click="closePic"><i class="iconfont icon-guanbi"></i></p>
      </div>
      <img :src="bigPic">
    </div>

    <van-popup v-model="showContent" style="border-radius: 3px;">
      <div class="showContentTitle">审核人</div>
      <div class="showContent">
        <div v-for="key in role_name" class="showRoleName">
          <div class="showImg">
            <img :src="key.avatar" v-if="key.avatar">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>姓名：{{key.name}}</p>
            <p>手机号：<a :href="'tel:' + key.phone">{{key.phone}}</a></p>
          </div>
        </div>
      </div>
      <div class="showContentFooter" @click="showContent = false">
        关闭
      </div>
    </van-popup>

    <van-popup v-model="answerFor" style="border-radius: 3px;">
      <div class="showContent">
        <div class="showRoleName">
          <div class="showImg">
            <img :src="personal.avatar" v-if="personal.avatar">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>报备人：{{personal.name}}</p>
            <p>手机号：<a :href="'tel:' + personal.phone">{{personal.phone}}</a></p>
          </div>
        </div>
        <div class="showRoleName" v-if="JSON.stringify(bull_name) !== '{}'">
          <div class="showImg">
            <img :src="bull_name.avatar" v-if="bull_name.avatar ">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>负责人：{{bull_name.name}}</p>
            <p>手机号：<a :href="'tel:' + bull_name.phone">{{bull_name.phone}}</a></p>
          </div>
        </div>
      </div>
      <div class="showContentFooter" @click="answerFor = false">
        关闭
      </div>
    </van-popup>

    <SwitchCraft v-if="approvedStatus && routerLinks.indexOf(this.process.processable_type) > -1"
                 :process="process"></SwitchCraft>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';
  import SwitchCraft from '../../common/switchCraft.vue';

  export default {
    name: "index",
    components: {ImagePreview, Toast, SwitchCraft},
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper'),
    },
    data() {
      return {
        // priceMin:'2000',
        // priceMax:'3000',
        urls: globalConfig.server_user,
        personalId: {},
        vLoading: true,
        disabled: false,
        printscreen: ['新凭证截图', '证件照片', '房产证照片', '旧凭证截图', '新押金收条', '旧押金收条', '押金收条', '款项结清截图', '特殊情况领导截图', '特殊情况截图', '特殊情况同意截图', '领导报备截图', '凭证截图', '合同照片', '截图', '领导同意截图', '组长同意截图', '房屋影像', '房屋照片', '退租交接单'],
        placeStatus: ['published', 'rejected', 'cancelled'],

        routerLinks: ['bulletin_quality', 'bulletin_collect_basic', 'bulletin_collect_continued', 'bulletin_rent_basic', 'bulletin_rent_continued', 'bulletin_rent_trans', 'bulletin_rent_RWC', 'bulletin_RWC_confirm', 'bulletin_change',],
        // address: '',
        message: '',
        ids: '',

        personal: {},
        place: {},
        formList: {},
        operation: {},
        process: {},
        commentList: [],

        page: 1,
        paging: 0,
        path: '',

        deal: '',

        onIndex: '',
        bigPic: '',
        photo: [],
        bigPicShow: false,

        placeFalse: false,
        videoSrc: '',

        bull_name: {},
        role_name: [],
        showContent: false,
        answerFor: false,

        approvedStatus: false,
        marking: '',
        priceRegion: '',
        showElectronicReceipt:true,   //展示电子收据
        bulletinId : '',              //报单id
        electronicReceiptParam:{} ,   //电子收据接口参数
        is_receipt: '',               //是否电子收据
        bank :{},                     //银行数据
        pdfLoading:'',                //加载pdf
        // sign_pdfUrl_exist:false,      //是否存在已签章电子收据
        // sign_pdfUrl_str:'',           //已签章电子收据url
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        if (from.path === '/') {
          sessionStorage.setItem('path', vm.path);
        }
        if (sessionStorage.path !== '/') {
          vm.routerIndex('');
          vm.ddRent('');
        } else {
          vm.ddRent('', 'close');
        }
      })
    },
    activated() {
      sessionStorage.setItem('count', '2');
      if(sessionStorage.personal){
        this.personalId = JSON.parse(sessionStorage.personal);
      }
      this.ids = this.$route.query.ids;
      this.page = 1;
      this.close_();
      this.disabled = false;
      this.search();
    },
    watch: {
      showContent(val) {
        if (val) {
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          document.getElementsByTagName('body')[0].className = '';
        }
      }
    },
    methods: {
      // 审批人信息
      approvePersonal(val) {
        if (val === 1) {
          if (this.place.auditors) {
            this.role_name = this.place.auditors;
            this.showContent = true;
          }
        } else {
          this.answerFor = true;
        }
      },

      IsPC() {
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "app/ApartMent"];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        return flag;
      },

      checkTv(val) {
        this.videoSrc = val;
      },

      close_() {
        this.showContent = false;
        this.answerFor = false;
        this.placeFalse = false;
        this.approvedStatus = false;
        this.vLoading = true;
        this.deal = '';
        this.videoSrc = '';
        this.formList = {};
        this.operation = {};
        this.personal = {};
        this.place = {};
        this.commentList = [];
      },

      loadMore() {
        if (!this.disabled) {
          this.comments(this.ids, this.page);
          this.page++;
        }
      },

      search() {
        this.formDetail(this.ids);
      },

      formDetail(val) {
        // let res = {};
        // res.data = {"status":"success","status_code":200,"message":"\u64cd\u4f5c\u6210\u529f","data":{"operation":{"to_cancelled":"\u64a4\u9500","to_comment":"\u8bc4\u8bba"},"deal":"\u8017\u65f62349\u5206\u949f","process":{"id":124285,"user_id":1016,"house_id":8278,"user":{"id":1016,"name":"\u9b4f\u826f\u4ed8","phone":"13912794460","ding_user_id":"015251510439263704","avatar":"https:\/\/static.dingtalk.com\/media\/lADPDgQ9qR_-y2TNA7jNArM_691_952.jpg","is_enable":null,"is_on_job":null,"org":[{"id":289,"name":"\u82cf\u5dde\u6e56\u897f\u4e8c\u7ec4","order":0,"parent_id":18,"depth":5,"leader_id":643,"is_leaf":true,"users":19,"ancestors":{"level-third":{"id":18,"name":"\u82cf\u5dde\u4e00\u533a","ding_department_id":42561601,"order":3,"is_enable":1,"parent_id":68,"leader_id":18,"lft":57,"rgt":82,"depth":4,"py":"szyq","pinyin":"suzhouyiqu","created_at":"2017-06-23 12:21:36","updated_at":"2018-10-21 08:19:18","deleted_at":null},"level-second":{"id":68,"name":"\u82cf\u5dde\u5206\u90e8","ding_department_id":30374670,"order":1,"is_enable":1,"parent_id":331,"leader_id":70,"lft":56,"rgt":133,"depth":3,"py":"szfb","pinyin":"suzhoufenbu","created_at":"2017-07-03 22:37:22","updated_at":"2018-10-21 08:19:18","deleted_at":null}},"created_at":"2018-07-03 14:46:25","updated_at":"2018-11-03 12:53:04","deleted_at":null}],"role":[{"id":246,"position_id":54,"name":"market-marketing-officer","display_name":"\u5e02\u573a\u4e13\u5458","description":"\u5e02\u573a\u4e13\u5458","created_at":"2018-04-19 13:16:48","updated_at":"2018-04-19 13:16:48"}],"py":"wlf","pinyin":"weiliangfu","created_at":"2018-04-11 17:26:05","updated_at":"2018-11-05 10:58:55"},"content":{"id":"1638","type":{"id":"0","name":"\u70b8\u5355"},"draft":{"id":0,"name":"\u53d1\u5e03"},"payWay":["2018-11-03~2019-11-02:\u62bc1\u4ed812"],"refund":{"id":0,"name":"\u5426"},"remark":"\u91cc\u6cb3\u65b0\u6751117-208\u5ba4\uff0c\u79df\u5ba2\u5c3e\u6b3e\u672a\u8865\u9f50\uff0c\u6ca1\u6709\u8fc7\u6765\u7b7e\u5408\u540c\u3002\u5b9a\u91d1\u4e0d\u9000\uff0c\u62a5\u70b8\u5355\uff0c\u671b\u5ba1\u6279\uff5e","address":"\u91cc\u6cb3\u65b0\u6751117-208","dataFrom":null,"house_id":8278,"is_draft":0,"staff_id":1016,"customers":"\u8521\u6587\u9759","price_arr":["2018-11-03~2019-11-02:2000\u5143"],"staff_name":"\u9b4f\u826f\u4ed8","contract_id":36434,"bulletindate":"2018-11-03 19:50:40","return_money":"0","show_content":{"\u5730\u5740":"\u91cc\u6cb3\u65b0\u6751117-208","\u5907\u6ce8":"\u91cc\u6cb3\u65b0\u6751117-208\u5ba4\uff0c\u79df\u5ba2\u5c3e\u6b3e\u672a\u8865\u9f50\uff0c\u6ca1\u6709\u8fc7\u6765\u7b7e\u5408\u540c\u3002\u5b9a\u91d1\u4e0d\u9000\uff0c\u62a5\u70b8\u5355\uff0c\u671b\u5ba1\u6279\uff5e","\u90e8\u95e8":"\u82cf\u5dde\u6e56\u897f\u4e8c\u7ec4","\u5f00\u5355\u4eba":"\u9b4f\u826f\u4ed8","\u6708\u5355\u4ef7":[{"msg":"2000\u5143","period":"2018.11.03-2019.11.02"}],"\u4ed8\u6b3e\u65b9\u5f0f":[{"msg":"\u62bc1\u4ed812","period":"2018.11.03-2019.11.02"}],"\u5df2\u6536\u91d1\u989d":199.8,"\u62a5\u5907\u7c7b\u578b":"\u79df\u623f\u70b8\u5355\u62a5\u5907","\u79df\u5ba2\u59d3\u540d":"\u8521\u6587\u9759","\u9000\u6b3e\u91d1\u989d":"0","\u9886\u5bfc\u540c\u610f\u622a\u56fe":[{"id":3965091,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FgTN1n3b2SgF_re-ummDrTz3lM4L","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FgTN1n3b2SgF_re-ummDrTz3lM4L","size":309952,"bucket":"lejia-prod","user_id":1016,"is_video":false,"raw_name":"Screenshot_20181103_194858.jpg","created_at":"2018-11-03 19:50:20","updated_at":"2018-11-03 19:50:20","display_name":"Screenshot_20181103_194858.jpg"}]},"bulletin_name":"\u79df\u623f\u70b8\u5355\u62a5\u5907","bulletin_type":"bulletin_lose","department_id":289,"draft_content":{"id":"","type":"0","draft":0,"payWay":["2018-11-03~2019-11-02:\u62bc1\u4ed812"],"refund":0,"remark":"\u91cc\u6cb3\u65b0\u6751117-208\u5ba4\uff0c\u79df\u5ba2\u5c3e\u6b3e\u672a\u8865\u9f50\uff0c\u6ca1\u6709\u8fc7\u6765\u7b7e\u5408\u540c\u3002\u5b9a\u91d1\u4e0d\u9000\uff0c\u62a5\u70b8\u5355\uff0c\u671b\u5ba1\u6279\uff5e","address":"\u91cc\u6cb3\u65b0\u6751117-208","house_id":8278,"staff_id":1016,"customers":"\u8521\u6587\u9759","price_arr":["2018-11-03~2019-11-02:2000\u5143"],"staff_name":"\u9b4f\u826f\u4ed8","contract_id":36434,"return_money":"0","bulletin_name":"\u79df\u623f\u70b8\u5355\u62a5\u5907","department_id":289,"finance_money":199.8,"collect_or_rent":"1","department_name":"\u82cf\u5dde\u6e56\u897f2\u7ec4","bulletin_staff_id":1016,"screenshot_leader":[3965091]},"finance_money":199.8,"house_address":"\u91cc\u6cb3\u65b0\u6751117-208","collect_or_rent":{"id":"1","name":"\u79df\u623f"},"department_name":"\u82cf\u5dde\u6e56\u897f2\u7ec4","bulletin_staff_id":1016,"screenshot_leader":{"pic_ids":[3965091],"pic_addresses":[{"id":3965091,"uri":"http:\/\/s.lejias.cn\/FgTN1n3b2SgF_re-ummDrTz3lM4L","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":309952,"bucket":"lejia-prod"},"name":"FgTN1n3b2SgF_re-ummDrTz3lM4L","user_id":1016,"raw_name":"Screenshot_20181103_194858.jpg","created_at":"2018-11-03 19:50:20","updated_at":"2018-11-03 19:50:20","display_name":"Screenshot_20181103_194858.jpg"}]},"show_content_compress":"{\"\u62a5\u5907\u7c7b\u578b\":\"\u79df\u623f\u70b8\u5355\u62a5\u5907\",\"\u5730\u5740\":\"\u91cc\u6cb3\u65b0\u6751117-208\",\"\u79df\u5ba2\u59d3\u540d\":\"\u8521\u6587\u9759\",\"\u4ed8\u6b3e\u65b9\u5f0f\":[{\"msg\":\"\u62bc1\u4ed812\",\"period\":\"2018.11.03-2019.11.02\"}],\"\u6708\u5355\u4ef7\":[{\"msg\":\"2000\u5143\",\"period\":\"2018.11.03-2019.11.02\"}],\"\u5df2\u6536\u91d1\u989d\":199.8,\"\u9000\u6b3e\u91d1\u989d\":\"0\",\"\u9886\u5bfc\u540c\u610f\u622a\u56fe\":[{\"id\":3965091,\"name\":\"FgTN1n3b2SgF_re-ummDrTz3lM4L\",\"raw_name\":\"Screenshot_20181103_194858.jpg\",\"display_name\":\"Screenshot_20181103_194858.jpg\",\"user_id\":1016,\"uri\":\"http:\/\/s.lejias.cn\/FgTN1n3b2SgF_re-ummDrTz3lM4L\",\"created_at\":\"2018-11-03 19:50:20\",\"updated_at\":\"2018-11-03 19:50:20\",\"ext\":\"image\/jpeg\",\"host\":\"http:\/\/s.lejias.cn\/\",\"mime\":\"image\/jpeg\",\"size\":309952,\"bucket\":\"lejia-prod\",\"is_video\":false}],\"\u5907\u6ce8\":\"\u91cc\u6cb3\u65b0\u6751117-208\u5ba4\uff0c\u79df\u5ba2\u5c3e\u6b3e\u672a\u8865\u9f50\uff0c\u6ca1\u6709\u8fc7\u6765\u7b7e\u5408\u540c\u3002\u5b9a\u91d1\u4e0d\u9000\uff0c\u62a5\u70b8\u5355\uff0c\u671b\u5ba1\u6279\uff5e\",\"\u5f00\u5355\u4eba\":\"\u9b4f\u826f\u4ed8\",\"\u90e8\u95e8\":\"\u82cf\u5dde\u6e56\u897f\u4e8c\u7ec4\"}"},"processable_id":1638,"processable_type":"bulletin_lose","place":{"name":"market-marketing-manager_review","status":"review","display_name":"\u7247\u533a\u7ecf\u7406\u5ba1\u6279\u4e2d","auditors":[{"id":643,"name":"\u961a\u6ce2","avatar":"https:\/\/static.dingtalk.com\/media\/lADPDgQ9qRV3BDnNBIDNA18_863_1152.jpg","phone":"13814803240","phone_check_code_ttl":"2018-11-04 20:11:08","email":null,"ding_user_id":"02621810651219080","is_on_job":null,"is_enable":null,"py":"hb","pinyin":"hanbo","created_at":"2018-02-22 21:13:28","updated_at":"2018-11-04 19:56:08","deleted_at":null}]},"finish_at":null,"created_at":"11-03 19:50","updated_at":"2018-11-03 19:50:40"}}}
        this.$http.get(this.urls + 'process/' + val).then((res) => {
          this.message = '';
          if (res.data.status === 'success' && res.data.data.length !== 0) {
            
            let content = res.data.data.process.content;
            this.formList = JSON.parse(content.show_content_compress);
            console.log(this.formList)
            // this.formList['开单人'] = content.staff_name;
            // if(content.collect_or_rent.id === '1'){
            //   this.formList['租客姓名'] = content.customers;
            // }else{
            //   this.formList['房东姓名'] = content.customers;
            // }
            // console.log(this.formList['开单人'])
            this.operation = res.data.data.operation;
            this.deal = res.data.data.deal;

            let houseName = res.data.data.process.content;
            if (houseName.address) {
              this.address = houseName.address;
            } else if (houseName.rent_without_collect_address) {
              this.address = houseName.rent_without_collect_address;
            } else {
              this.address = houseName.house.name;
            }
            let main = res.data.data.process;
            this.process = main;
            this.personal = main.user;
            // this.confirmBulletinType(res.data.data.process);
            this.place = main.place;
            this.placeFalse = this.placeStatus.indexOf(main.place.status) === -1 ? true : false;

            // this.$http.get(globalConfig.server + 'manager/staff/' + main.user.org[0].leader_id).then((res) => {
            //   if (res.data.code === '10020') {
            //     this.bull_name = res.data.data;
            //   }
            // });
            let user_id = [];
            user_id.push(main.user.org[0].leader_id);
            this.$http.post(globalConfig.server + 'special/special/userInfos', {id: user_id}).then((res) => {
              if (res.data.code === '10080') {
                this.bull_name = res.data.data[0];
              }
            });

            if (houseName.quality_up && main.place.name === 'appraiser-officer_review') {
              this.marking = 1;
            } else {
              this.marking = 2;
            }
            if( this.placeFalse && this.marking === 1){
              let price = {};
              price.community = houseName.community.id;
              price.decorate = houseName.decorate.id;
              price.room = houseName.house_type[0];
              this.priceArea(price);
            }
            // this.showSignElectronicReceipt();
          } else {
            this.personal.avatar = '';
            this.personal.name = 'XXXX';
            this.message = res.data.message;
          }
          this.vLoading = false;
          for (let key in this.operation) {
            if (key.indexOf('approved') > -1) {
              this.approvedStatus = true;
              return;
            }
          }
        });
      },
      // 价格区间
      priceArea(price) {
        this.$http.get(globalConfig.server + 'bulletin/quality/range', {
          params: price,
        }).then((res) => {
          console.log(res);
          this.priceRegion = res.data.priceMin + '~' + res.data.priceMax + '元';
        });
      },
      comments(val, page) {
        this.$http.get(this.urls + 'comments?id=' + val, {
          params: {
            page: page,
          }
        }).then((res) => {
          let data = res.data.data;
          this.paging = res.data.meta.total;
          if (res.data.status === 'success' && data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              this.commentList.push(data[i]);
            }
          } else {
            this.disabled = true;
          }
        })
      },

      pics(val, index, video) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].uri);
        }
        if (this.IsPC()) {
          this.photo = arr;
          this.onIndex = index;
          this.bigPic = arr[index];
          this.bigPicShow = true;
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          ImagePreview(arr, index);
        }
      },

      next(val) {
        this.onIndex++;
        if (this.onIndex === val.length) {
          this.onIndex = 0;
        }
        this.bigPic = val[this.onIndex];
      },

      pre(val) {
        this.onIndex--;
        if (this.onIndex < 0) {
          this.onIndex = val.length - 1;
        }
        this.bigPic = val[this.onIndex];
      },

      closePic() {
        this.bigPicShow = false;
        document.getElementsByTagName('body')[0].className = '';
      },

      // 评论
      commentOn(val, index) {
        this.close_();
        let num;
        num = val.indexOf('approved') > -1 ? index : 2;
        this.$router.push({
          path: '/comment',
          query: {detail: val, ids: this.ids, marking: num}
        });
      },
      //确认订单类型是否需要生成电子收据
      confirmBulletinType(_process){
        console.log(_process)
        if(this.process.place.status === 'review' && this.process.place.display_name === "片区经理审批中" && _process.content.is_receipt.id === 1){
          //报备类型
          let _type = this.process.processable_type;
          //报备类型数组
          let bulletinArr = ['bulletin_agency','bulletin_rent_basic','bulletin_rent_continued','bulletin_rent_trans','bulletin_change','bulletin_rent_RWC','bulletin_RWC_confirm','bulletin_retainage'];
          if(bulletinArr.includes(_type)){
            this.showElectronicReceipt = true;
            this.bulletinId =_process.id;
            this.is_receipt = _process.content.is_receipt;

            this.electronicReceiptParam.process_id = _process.id;
            this.electronicReceiptParam.department_id = _process.content.department_id;
            this.electronicReceiptParam.account_id = _process.content.account_id || [];
            this.electronicReceiptParam.deposit = _process.content.front_money;
            this.electronicReceiptParam.mortgage = _process.content.deposit_payed;
            this.electronicReceiptParam.rental = _process.content.rent_money;
            this.electronicReceiptParam.duration = _process.content.show_content["现签约时长"] || _process.content.show_content["签约时长"]
            this.electronicReceiptParam.money_sep = _process.content.money_sep;
            this.electronicReceiptParam.address = _process.content.address;

            if(_type === 'bulletin_retainage'){
              this.electronicReceiptParam.payer = _process.content.customer_name;
              this.electronicReceiptParam.sign_at = _process.content.retainage_date;
              this.electronicReceiptParam.price = _process.content.price_arr.map(item => {
                  return item.split(':')[1];
                }).join(",");
              this.electronicReceiptParam.pay_way = _process.content.payWay.join(',')
            }else{
              this.electronicReceiptParam.payer = _process.content.name;
              this.electronicReceiptParam.sign_at = _process.content.sign_date;
              this.electronicReceiptParam.price = _process.content.price_arr.map(item => {
                return item + "元"
              }).join(',');
              this.electronicReceiptParam.pay_way = _process.content.pay_way_str.map((item) => {
                return item.msg + " " + item.period;
              }).join(',');
            }
            _process.content.money_way.forEach((item, index) => {
              this.bank["bank" + (index + 1)] = item;
            });
            let _str = JSON.stringify(this.electronicReceiptParam);
            let _bank = JSON.stringify(this.bank);
            sessionStorage.setItem('electronicReceiptParam' , _str);
            sessionStorage.setItem('bank',_bank);
            sessionStorage.setItem('showElectronicReceipt',true)
            console.log(1)
          }else{
            sessionStorage.setItem('showElectronicReceipt',false)
          }
        }else{
          if(sessionStorage.getItem('showElectronicReceipt')){
            sessionStorage.setItem('showElectronicReceipt',false)
          }
        }
      },
      // 重新提交
      newly() {
        let proID = this.process.processable_id;
        let list = {newID: proID, ids: '', type: 1};
        switch (this.process.processable_type) {
          case 'bulletin_quality'://质量
            this.$router.push({path: '/quality', query: list});
            break;
          case 'bulletin_collect_basic'://收
            this.$router.push({path: '/collectReport', query: list});
            break;
          case 'bulletin_collect_continued'://续收报备
            this.$router.push({path: '/continueCollect', query: list});
            break;
          case 'bulletin_rent_basic'://租
            this.$router.push({path: '/rentReport', query: list});
            break;
          case 'bulletin_rent_trans'://转租
            this.$router.push({path: '/changeRent', query: list});
            break;
          case 'bulletin_rent_continued'://续租
            this.$router.push({path: '/continueRent', query: list});
            break;
          case 'bulletin_rent_RWC'://未收先祖
            this.$router.push({path: '/unCollectBeforeRent', query: list});
            break;
          case 'bulletin_RWC_confirm'://未收先祖确定
            this.$router.push({path: '/unCollectBeforeRentSure', query: list});
            break;
          case 'bulletin_agency'://中介费报备
            this.$router.push({path: '/agencyRent', query: list});
            break;
          case 'bulletin_banish'://清退
            this.$router.push({path: '/clearRetreat', query: list});
            break;
          case 'bulletin_change'://调房
            this.$router.push({path: '/transferReport', query: list});
            break;
          case 'bulletin_lose'://炸单
            this.$router.push({path: '/friedBill', query: list});
            break;
          case 'bulletin_refund'://退款
            this.$router.push({path: '/drawback', query: list});
            break;
          case 'bulletin_retainage'://尾款
            this.$router.push({path: '/finalPayment', query: list});
            break;
          case 'bulletin_special'://特殊
            this.$router.push({path: '/special', query: list});
            break;
          case 'bulletin_checkout'://退租
            this.$router.push({path: '/checkout', query: list});
            break;
        }
      },
    },
  }
</script>

<style lang="scss">
#cardDetail {
  overflow: hidden;
  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  @mixin border_radius($p) {
    -webkit-border-radius: $p;
    -moz-border-radius: $p;
    border-radius: $p;
  }

  @mixin scale($p) {
    -moz-transform: scale($p, $p);
    -webkit-transform: scale($p, $p);
    -o-transform: scale($p, $p);
    transform: scale($p, $p);
  }

  $onColor: #39b1ff;
  $borColor: #9c9c9c;

  @keyframes manger {
    from {
      @include scale(6);
    }
    to {
      @include scale(1);
    }
  }

  @-moz-keyframes manger {
    from {
      @include scale(6);
    }
    to {
      @include scale(1);
    }
  }

  @-webkit-keyframes manger {
    from {
      @include scale(6);
    }
    to {
      @include scale(1);
    }
  }

  @-o-keyframes manger {
    from {
      @include scale(6);
    }
    to {
      @include scale(1);
    }
  }

  .showContentTitle,
  .showContentFooter {
    text-align: center;
    padding: 0.3rem 0;
    font-size: 0.36rem;
  }
  .showContentTitle {
    border-bottom: 1px solid #f4f4f4;
  }
  .showContentFooter {
    border-top: 1px solid #f4f4f4;
    color: #409eff;
  }
  .showContent {
    width: 6.6rem;
    max-height: 8rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    p {
      color: #6a6a6a;
      margin: 0.12rem 0;
      a {
        color: $onColor;
      }
    }
    .showRoleName + .showRoleName {
      border-top: 1px solid #f4f4f4;
    }
    .showRoleName {
      @include flex;
      align-items: center;
      padding: 0.2rem;
      .showImg {
        min-width: 0.9rem;
        max-width: 0.9rem;
        height: 0.9rem;
        margin-right: 0.2rem;
        img {
          width: 100%;
          height: 100%;
          @include border_radius(50%);
        }
      }
    }
  }

  .placeFinish {
    @include flex;
    justify-content: center;
    flex-direction: column;
    height: 1.4rem;

    .placeSpan {
      color: #409eff;
      @include flex;
      align-items: center;
      i {
        margin-right: 0.1rem;
      }
    }
    .deal {
      margin-top: 0.18rem;
      color: $borColor;
    }
  }

  #videoId {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    @include flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 1);
    z-index: 10000;
    #video {
      position: absolute;
      top: 7.5%;
      left: 5%;
    }
    .close {
      position: absolute;
      width: 0.8rem;
      height: 0.8rem;
      text-align: center;
      line-height: 0.8rem;
      @include border_radius(50%);
      /*background-color: rgba(0, 0, 0, .8);*/
      bottom: 1rem;
      /*border: 1px solid rgba(255, 255, 255, .8);*/
      right: 2%;
      top: 2%;
      transform: translate(-50%);
      i {
        color: #ffffff;
        font-size: 0.6rem;
      }
    }
  }

  .bigPhotos {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    text-align: center;
    @include flex;
    align-items: center;
    justify-content: center;
    div {
      p {
        position: absolute;
        bottom: 0;
        width: 50%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-weight: bold;
        color: #ffffff;
        margin: 0 0.2rem;
        border-radius: 50%;
        i {
          display: inline-block;
          font-size: 1rem;
        }
      }
      .nextPic,
      .prePic {
        height: 100%;
        @include flex;
        align-items: center;
      }
      .nextPic {
        left: 0;
        text-align: left;
        justify-content: flex-start;
        i {
          transform: rotate(180deg);
        }
      }
      .prePic {
        right: 0;
        text-align: right;
        justify-content: flex-end;
      }
      .close {
        width: 1rem;
        bottom: 0.6rem;
        left: 50%;
        transform: translate(-50%);
        i {
          font-size: 0.6rem;
        }
      }
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .photo {
    p {
      padding-top: 0.2rem;
    }
    h1 {
      @include flex;
      flex-wrap: wrap;
      span {
        width: 1rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-right: 0.2rem;
      }
    }
  }

  .detail {
    img {
      width: 100%;
      height: 100%;
    }
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    @include flex;
    align-items: center;
    background: #ffffff;
    padding: 0.3rem;
    .detailLeft {
      min-width: 0.9rem;
      max-width: 0.9rem;
      margin-right: 0.3rem;
      div {
        width: 100%;
        height: 0.9rem;
        overflow: hidden;
        img {
          @include border_radius(50%);
          width: 100%;
          height: 100%;
        }
      }
    }
    .priceRange {
      position: absolute;
      right: 0.4rem;
      bottom: 0.1rem;
      color: orange;
    }
    .topRight {
      @include flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .personal {
        min-width: 2.8rem;
        max-width: 2.8rem;
        p {
          min-width: 2.8rem;
          max-width: 2.8rem;
          line-height: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #9c9c9c;
        }
        p:first-of-type {
          color: #101010;
        }
      }
      .statusSuccess {
        background: url("../../../assets/tongguo.png") no-repeat;
      }
      .statusFail {
        background: url("../../../assets/shibai.png") no-repeat;
      }
      .cancelled {
        background: url("../../../assets/chexiao.png") no-repeat;
      }
      .statusSuccess,
      .statusFail,
      .cancelled {
        width: 1.4rem;
        height: 1.4rem;
        background-size: 100% 100%;
        @include scale(1);
        -webkit-animation: manger 0.6s ease-in-out;
        -o-animation: manger 0.6s ease-in-out;
        animation: manger 0.6s ease-in-out;
      }
    }
  }
  .detailRight {
    img {
      width: 100%;
      height: 100%;
    }
    width: 100%;
    .topTitle {
      padding: 0.3rem;
      margin-top: 2rem;
      background: #ffffff;
      div {
        margin: 0.2rem 0;
        @include flex;
        word-break: break-all;
        p {
          min-width: 1.8rem;
          max-width: 1.8rem;
          margin-right: 0.4rem;
          line-height: 0.4rem;
          color: #9c9c9c;
          text-align: left;
        }
        h1 {
          color: #101010;
          line-height: 0.4rem;
        }
        .electronicReceipt{
          color:green
        }
      }
      .load {
        display: flex;
        justify-content: center;
        margin: 3rem auto 0;
      }
    }

    .commentArea {
      margin-top: 0.3rem;
      padding-bottom: 0.36rem;
      background: #ffffff;
      color: #101010;

      div,
      p,
      span {
        color: #9c9c9c;
      }
      .headline {
        color: #444444;
        font-size: 0.33rem;
        padding: 0.3rem 0 0.2rem 0.3rem;
        font-weight: bold;
        border-bottom: 1px solid #dddddd;
        span {
          font-size: 0.33rem;
          font-weight: bold;
          color: #444444;
          padding-left: 0.1rem;
        }
      }
      .commentAreaMain {
        margin-top: 0.36rem;
        padding: 0 0.4rem;
        .commentTitle {
          @include flex;
          align-items: center;
          justify-content: space-between;
          .staff {
            @include flex;
            align-items: center;
            p {
              min-width: 0.8rem;
              max-width: 0.8rem;
              height: 0.8rem;
              margin-right: 0.12rem;
              img {
                @include border_radius(50%);
              }
            }
            div {
              width: 100%;
              overflow: hidden;
              line-height: 0.9rem;
              -ms-text-overflow: ellipsis;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .times {
            min-width: 2rem;
            max-width: 2rem;
            text-align: right;
          }
        }
        .contents {
          margin-left: 0.9rem;
          color: #101010;
          line-height: 0.6rem;
        }
        .pics {
          @include flex;
          flex-wrap: wrap;
          margin-left: 0.9rem;
          div {
            width: 1rem;
            height: 1rem;
            margin: 0.2rem 0.3rem 0 0;
          }
        }
      }
    }
  }
  .bottom {
    @include flex;
    justify-content: center;
    align-items: center;
    padding: 0.4rem 0 1.3rem;
    color: #dddddd;
  }
}
</style>
