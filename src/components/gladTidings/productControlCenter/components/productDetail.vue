<template>
  <div>
    <div v-if="Object.keys(detailData).length>0">
      <div class="banner">
        <div v-if="albumData.length<1&&detailData.house_goods&&detailData.house_goods.photo">
          <van-swipe :autoplay="0" :show-indicators="false" @change="onChange">
            <van-swipe-item v-if="detailData.house_goods"
                            v-for="(image, index) in detailData.house_goods.photo" :key="index">
              <div class="img" @click="showLargePic(detailData.house_goods.photo,index)">
                <img v-if="image.info.mime&&image.info.mime.indexOf('image')>-1" :src="image.uri"/>
                <img src="../../../../assets/noPic.png" v-else>
              </div>
            </van-swipe-item>
          </van-swipe>
          <div class="indicators">{{imgIndex}}/{{detailData.house_goods.photo.length}}</div>
        </div>
        <div class="img" v-if="!detailData.house_goods && albumData.length<1">
          <img src="../../../../assets/noPic.png" alt="">
        </div>
        <div v-if="albumData.length>0">
          <van-swipe :autoplay="0" :show-indicators="false" @change="onChange">
            <van-swipe-item v-for="(image, index) in albumData[albumData.length-1].album.album_file" :key="index">
              <div class="img" @click="showLargePic(albumData[albumData.length-1].album.album_file,index)">
                <img v-if="image.info.mime&&image.info.mime.indexOf('image')>-1" :src="image.uri"/>
                <img src="../../../../assets/noPic.png" v-else alt="">
              </div>
            </van-swipe-item>
          </van-swipe>
          <div class="indicators">{{imgIndex}}/{{albumData[albumData.length-1].album.album_file.length}}</div>
        </div>
      </div>
      <div class="mainContent">
        <div class="content_top">
          <div class="address">
            <h3>
              <span v-if="detailData.community">{{detailData.community.name}}</span>
              <span>{{detailData.door_address}}</span>
            </h3>
            <div style="font-size: .2rem;color: #777" v-if="detailData.community">
              {{detailData.community.detailed_address}}
            </div>
            <div>
              <i class="iconfont icon-favoritesfilling"
                 style="font-size: .2rem;color: #FFD000" v-for="item in 5">
              </i>
              <span class="otherInfo">
              <span v-if="detailData.is_again_rent>0">二次出租</span>
              <span v-else="">首次出租</span>
            </span>
              <span class="otherInfo" v-if="detailData.house_feature">
              {{all_dic[detailData.house_feature]}}
            </span>
            </div>
          </div>
          <div class="rentStatus">
            <div style="width: 100%;font-size: .33rem;font-weight: bold;color: #e4393c">
              <span style="color: #1ecb4e" v-if="detailData.status==1">已出租</span>
              <span style="color: #777" v-else-if="detailData.status == 2">待收房</span>
              <span style="color: #ef4292" v-else="">未出租</span>
            </div>

            <span style="font-size: .2rem;color: #777"
                  v-if="detailData.current_ready_days&&!isNaN(detailData.current_ready_days)">已空置{{detailData.current_ready_days}}天</span>
            <span style="font-size: .2rem;color: #777"
                  v-if="detailData.current_ready_days&&isNaN(detailData.current_ready_days)">{{detailData.current_ready_days}}</span>

          </div>
        </div>

        <div class="content_other">
          <div>{{detailData.area}}</div>
          <div v-if="detailData.floor">{{detailData.floor.this}}/{{detailData.floor.all}}层</div>
          <div v-if="detailData.house_type">
            {{detailData.house_type[0]}}室{{detailData.house_type[1]}}厅{{detailData.house_type[2]}}卫
          </div>
          <div v-if="detailData.direction">{{detailData.direction.name}}</div>
        </div>

        <div class="more_detail">
          <van-row class="row_item">
            <van-col span="10">
              <van-row>
                <van-col span="8" class="key">方式 :</van-col>
                <van-col span="16" class="value">/</van-col>
              </van-row>
            </van-col>
            <van-col span="14">
              <van-row>
                <van-col span="12" class="key">负责人 :</van-col>
                <van-col span="12" class="value" v-if="detailData.staffs">{{detailData.staffs.name}}</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="row_item">
            <van-col span="10">
              <van-row>
                <van-col span="8" class="key">装修 :</van-col>
                <van-col span="16" class="value" v-if="detailData.decorate">{{all_dic[detailData.decorate]}}
                </van-col>
              </van-row>
            </van-col>
            <van-col span="14">
              <van-row>
                <van-col span="12" class="key">所属部门 :</van-col>
                <van-col span="12" class="value" v-if="detailData.department">{{detailData.department.name}}</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="row_item">
            <van-col span="10">
              <van-row>
                <van-col span="8" class="key">类型 :</van-col>
                <van-col span="16" class="value" v-if="detailData.property_type">{{detailData.property_type.name}}
                </van-col>
              </van-row>
            </van-col>
            <van-col span="14">
              <van-row>
                <van-col span="12" class="key">房屋剩余时长 :</van-col>
                <van-col span="12" class="value">{{detailData.lord_remainder_days}}天</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="row_item">
            <van-col span="10">
              <van-row>
                <van-col span="8" class="key">特色 :</van-col>
                <van-col span="16" class="value" v-if="detailData.house_feature">
                  {{all_dic[detailData.house_feature]}}
                </van-col>
              </van-row>
            </van-col>
            <van-col span="14">
              <van-row>
                <van-col span="12" class="key">租晚于收结束 :</van-col>
                <van-col span="12" class="value">
                  <span v-if="detailData.rent_end_than_days>0">晚于{{detailData.rent_end_than_days}}天</span>
                  <span v-else-if="detailData.rent_end_than_days<0">否</span>
                  <span v-else="">/</span>
                </van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>

        <div class="house_set" v-if="detailData.house_goods">
          <div class="title" style='margin-bottom: .2rem'>房屋配套</div>
          <div>
            <van-row class="house_set_item">
              <van-col span="4" class="key">装修 :</van-col>
              <van-col span="20" class="value">
                沙发*{{detailData.house_goods.sofa}}, 晾衣架*{{detailData.house_goods.clothe_rack}},
                餐桌*{{detailData.house_goods.dining_table}}, 椅子*{{detailData.house_goods.chair}},
                床+床垫(<span v-if="detailData.house_goods.bed">齐全</span><span v-else="">不齐</span>),
                衣柜(<span v-if="detailData.house_goods.wardrobe_remark">齐全</span><span v-else="">齐全</span>),
                窗帘(<span v-if="detailData.house_goods.curtain">齐全</span><span v-else="">齐全</span>)
              </van-col>
            </van-row>
            <van-row class="house_set_item">
              <van-col span="4" class="key">家电 :</van-col>
              <van-col span="20" class="value">
                空调*{{detailData.house_goods.air_condition}}, 冰箱*{{detailData.house_goods.fridge}},
                电视*{{detailData.house_goods.television}}, 燃气灶*{{detailData.house_goods.gas_stove}},
                油烟机*{{detailData.house_goods.hood}}, 微波炉*{{detailData.house_goods.microwave}},
                洗衣机*{{detailData.house_goods.wash_machine}}, 热水器*{{detailData.house_goods.water_heater}}
              </van-col>
            </van-row>
            <van-row class="house_set_item">
              <van-col span="4" class="key">其他 :</van-col>
              <van-col span="20" class="value">
                <span v-if="detailData.house_goods.heater">暖气,</span><span v-else=""></span>
                <span v-if="detailData.house_goods.gas">天然气,</span><span v-else=""></span>
                <span v-if="detailData.house_goods&&detailData.house_goods.other_furniture!='无'">
                {{detailData.house_goods.other_furniture}}
              </span>
              </van-col>
            </van-row>
          </div>
        </div>

        <div class="house_img">
          <div class="img_title">
            <div class="title">房屋照片</div>
            <div class="more" v-if="albumData.length>3" @click="router('img',detailData.id)">查看更多></div>
          </div>
          <div class="imgContent">
            <div class="imgItem" v-for="(item,index) in albumData" v-if="index<4"
                 @click="showLargePic(item.album.album_file,0)">
              <div v-if="item.album.album_file[0].info.mime&&item.album.album_file[0].info.mime.indexOf('image')>-1">
                <img :src="item.album.album_file[0].uri" style="width: 1.2rem;height: 1.2rem" alt="">
                <div style="font-size: .24rem;color: #777">{{item.create_time.split(' ')[0]}}</div>
              </div>
            </div>
            <div class="imgItem" v-if="albumData.length<4 && detailData.house_goods"
                 @click="showLargePic(detailData.house_goods.photo,0)">
              <div
                v-if="detailData.house_goods.photo[0].info.mime&&detailData.house_goods.photo[0].info.mime.indexOf('image')>-1">
                <img :src="detailData.house_goods.photo[0].uri" style="width: 1.2rem;height: 1.2rem" alt="">
                <div style="font-size: .24rem;color: #777">{{detailData.create_time.split(' ')[0]}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="house_img" v-if="videoArray.length>0">
          <div class="img_title">
            <div class="title">视频影像</div>
          </div>
          <div class="imgContent">
            <div class="imgItem" v-for="(item,index) in videoArray">
              <img src="../../../../assets/video.jpg" @click="checkTv(item.uri)" style="width: 1.2rem;height: 1.2rem"
                   alt="">
            </div>
          </div>
        </div>

        <div id="videoId" v-if="videoSrc !== ''">
          <video style="position: absolute; top: 6%;left: 5%;" :src="videoSrc" muted controls autoplay width="90%"
                 height="100%"></video>
          <p class="close" @click="checkTv('')"><i class="iconfont icon-cuowutishi"></i></p>
        </div>

        <div class="house_contract">
          <div class="contract_title">
            <div class="title">相关合同</div>
            <div class="more" @click="router('contract',detailData.id)" v-if="lords.length>0||renters.length>0">查看更多>
            </div>
          </div>
          <div class="contractInfo" v-if="lords.length>0" @click="searchCollectDetail(lords[0].id)">
            <van-row class="contractItem">
              <van-col class="itemWord" span="5">合同编号 :</van-col>
              <van-col class="itemWord" span="19">{{lords[0].contract_number}}</van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col class="itemWord" span="5">合同状态 :</van-col>
              <van-col class="itemWord" span="19">
                <span v-if="lords[0].status == 1">未签约</span>
                <span v-else-if="lords[0].status == 2">已签约</span>
                <span v-else-if="lords[0].status == 3">快到期(60天内)</span>
                <span v-else-if="lords[0].status == 4">已结束</span>
                <span v-else-if="lords[0].status == 5">已过期</span>
                <span v-else="">/</span>
              </van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">报备时间 :</van-col>
                  <van-col class="itemWord" span="14">{{lords[0].created_at.split(' ')[0]}}</van-col>
                </van-row>
              </van-col>
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">签约时长 :</van-col>
                  <van-col class="itemWord" span="14">{{lords[0].duration_days}}天</van-col>
                </van-row>
              </van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">开单人 :</van-col>
                  <van-col class="itemWord" span="14">{{lords[0].sign_user.name}}</van-col>
                </van-row>
              </van-col>
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">客户姓名 :</van-col>
                  <van-col class="itemWord" span="14">{{lords[0].customers.name}}</van-col>
                </van-row>
              </van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">所属部门 :</van-col>
                  <van-col class="itemWord" span="14">{{lords[0].sign_org.name}}</van-col>
                </van-row>
              </van-col>
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">结束时间 :</van-col>
                  <van-col class="itemWord" span="14">{{lords[0].end_at}}</van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
          <div class="contractInfo" v-else=""
               style="text-align: center;font-size: .5rem;color: #777;height: 3rem;line-height: 3rem">
            暂无生效收房合同
          </div>

          <div class="contractInfo" v-if="renters.length>0" @click="searchRentDetail(renters[0].id)">
            <van-row class="contractItem">
              <van-col class="itemWord" span="5">合同编号 :</van-col>
              <van-col class="itemWord" span="19">{{renters[0].contract_number}}</van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col class="itemWord" span="5">合同状态 :</van-col>
              <van-col class="itemWord" span="19">
                <span v-if="renters[0].status == 1">未签约</span>
                <span v-else-if="renters[0].status == 2">已签约</span>
                <span v-else-if="renters[0].status == 3">快到期(60天内)</span>
                <span v-else-if="renters[0].status == 4">已结束</span>
                <span v-else-if="renters[0].status == 5">已过期</span>
                <span v-else="">/</span>
              </van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">报备时间 :</van-col>
                  <van-col class="itemWord" span="14">{{renters[0].created_at.split(' ')[0]}}</van-col>
                </van-row>
              </van-col>
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">签约时长 :</van-col>
                  <van-col class="itemWord" span="14">{{renters[0].duration_days}}天</van-col>
                </van-row>
              </van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">开单人 :</van-col>
                  <van-col class="itemWord" span="14">{{renters[0].sign_user.name}}</van-col>
                </van-row>
              </van-col>
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">客户姓名 :</van-col>
                  <van-col class="itemWord" span="14">{{renters[0].customers.name}}</van-col>
                </van-row>
              </van-col>
            </van-row>
            <van-row class="contractItem">
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">所属部门 :</van-col>
                  <van-col class="itemWord" span="14">{{renters[0].sign_org.name}}</van-col>
                </van-row>
              </van-col>
              <van-col span="12">
                <van-row>
                  <van-col class="itemWord" span="10">结束时间 :</van-col>
                  <van-col class="itemWord" span="14">{{renters[0].end_at}}</van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
          <div class="contractInfo" v-else=""
               style="text-align: center;font-size: .5rem;color: #777;height: 3rem;line-height: 3rem">
            暂无生效租房合同
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: 'hello',
    components: {ImagePreview, Toast},
    data() {
      return {
        imgIndex: 1,
        detailData: {},
        albumData: [],
        lords: [],
        renters: [],
        videoArray: [],

        videoSrc: '',
        all_dic: {},
        largePic: null,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('productControlCenter', 'house');
        vm.ddRent('productControlCenter', 'house');
      })
    },
    beforeRouteLeave(to, from, next) {
      Toast.clear();
      if (this.largePic) {
        this.largePic.close();
      }
      next();
    },
    mounted() {
      this.getDictionary();
    },
    activated() {
      if (this.$route.query.id) {
        this.getData();
      }
    },
    methods: {
      //字典匹配
      getDictionary() {
        this.$http.get(globalConfig.server + 'setting/dictionary/all').then((res) => {
          this.all_dic = res.data.data;
          res.data.data.forEach((item) => {
            this.all_dic[item.id] = item.dictionary_name;
          });
        })
      },
      // matchDictionary(id) {
      //   let dictionary_name = null;
      //   console.log(2);
      //   console.log(this.all_dic);
      //   this.all_dic.map((item) => {
      //     if (item.id == id) {
      //       dictionary_name = item.dictionary_name;
      //     }
      //   });
      //   return dictionary_name;
      // },
      checkTv(val) {
        this.videoSrc = val;
      },
      getData() {
        let res = {};
        res.data = {"code":"30070","msg":"查询成功","data":{"album":[{"id":18798,"house_id":28378,"album":{"album_file":[{"id":3662885,"uri":"http:\/\/s.lejias.cn\/FssDeKmcg4ovmFheGqVW10MDjliV","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":178561,"bucket":"lejia-prod"}},{"id":3662886,"uri":"http:\/\/s.lejias.cn\/FiAGwoxfPP0xgVPBed6So-X79s5K","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":140294,"bucket":"lejia-prod"}},{"id":3662887,"uri":"http:\/\/s.lejias.cn\/FiZcTg0dCNndWvPoDfoIsskrczHC","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3679467,"bucket":"lejia-prod"}},{"id":3662889,"uri":"http:\/\/s.lejias.cn\/FhSxiSWC9510L_GbKCHrZjxGU8NR","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3687037,"bucket":"lejia-prod"}},{"id":3662891,"uri":"http:\/\/s.lejias.cn\/FvpdFMJpvqRkcwGaYc9WMFR3Cv-M","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":2915784,"bucket":"lejia-prod"}},{"id":3662892,"uri":"http:\/\/s.lejias.cn\/Fl0Te9CtAhdQiqy7pfSaJqOuEaxM","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3366664,"bucket":"lejia-prod"}},{"id":3662898,"uri":"http:\/\/s.lejias.cn\/Fpil7dodN-twqYmDSJv31reiu22j","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3589641,"bucket":"lejia-prod"}},{"id":3662901,"uri":"http:\/\/s.lejias.cn\/FqvIQ_eHfcyw2PbXkBNjnLwY9l-K","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3886971,"bucket":"lejia-prod"}},{"id":3662934,"uri":"http:\/\/s.lejias.cn\/o_1cq8j152uri67mf1caif0uqon1p.mp4","info":{"ext":"video\/mp4","host":"http:\/\/s.lejias.cn\/","mime":"video\/mp4","size":84413488,"bucket":"lejia-prod"}}]},"remark":null,"create_time":"2018-10-20 19:27:45","staff_id":2779,"old_data":{"价格":"3000","冰箱":"1台","地址":"理想银泰城10-1-3534","户型":"1室1厅1卫","暖气":"有","朝向":"东","椅子":"0把","楼层":"35","沙发":"1个","电视":"1台","空调":"1台","装修":"精装","部门":"杭州余杭临平组","面积":"52","餐桌":"0张","天然气":"有","床备注":"暂无","开单人":"吴栋梁","微波炉":"1台","总楼层":"42","晾衣架":"1个","油烟机":"1台","洗衣机":"1台","热水器":"1台","燃气灶":"1个","其他问题":"暂无","房屋影像":[{"id":3662885,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FssDeKmcg4ovmFheGqVW10MDjliV","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FssDeKmcg4ovmFheGqVW10MDjliV","size":178561,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"mmexport1540030073071.jpg","created_at":"2018-10-20 19:15:22","updated_at":"2018-10-20 19:15:22","display_name":"mmexport1540030073071.jpg"},{"id":3662886,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FiAGwoxfPP0xgVPBed6So-X79s5K","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FiAGwoxfPP0xgVPBed6So-X79s5K","size":140294,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"Screenshot_20181020-180421.jpg","created_at":"2018-10-20 19:15:24","updated_at":"2018-10-20 19:15:24","display_name":"Screenshot_20181020-180421.jpg"},{"id":3662887,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FiZcTg0dCNndWvPoDfoIsskrczHC","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FiZcTg0dCNndWvPoDfoIsskrczHC","size":3679467,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"IMG20181020121244.jpg","created_at":"2018-10-20 19:15:30","updated_at":"2018-10-20 19:15:30","display_name":"IMG20181020121244.jpg"},{"id":3662889,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FhSxiSWC9510L_GbKCHrZjxGU8NR","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FhSxiSWC9510L_GbKCHrZjxGU8NR","size":3687037,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"IMG20181020121247.jpg","created_at":"2018-10-20 19:15:33","updated_at":"2018-10-20 19:15:33","display_name":"IMG20181020121247.jpg"},{"id":3662891,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FvpdFMJpvqRkcwGaYc9WMFR3Cv-M","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FvpdFMJpvqRkcwGaYc9WMFR3Cv-M","size":2915784,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"IMG20181020121253.jpg","created_at":"2018-10-20 19:15:35","updated_at":"2018-10-20 19:15:35","display_name":"IMG20181020121253.jpg"},{"id":3662892,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/Fl0Te9CtAhdQiqy7pfSaJqOuEaxM","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"Fl0Te9CtAhdQiqy7pfSaJqOuEaxM","size":3366664,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"IMG20181020121259.jpg","created_at":"2018-10-20 19:15:42","updated_at":"2018-10-20 19:15:42","display_name":"IMG20181020121259.jpg"},{"id":3662898,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/Fpil7dodN-twqYmDSJv31reiu22j","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"Fpil7dodN-twqYmDSJv31reiu22j","size":3589641,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"IMG20181020121305.jpg","created_at":"2018-10-20 19:15:48","updated_at":"2018-10-20 19:15:48","display_name":"IMG20181020121305.jpg"},{"id":3662901,"ext":"image\/jpeg","uri":"http:\/\/s.lejias.cn\/FqvIQ_eHfcyw2PbXkBNjnLwY9l-K","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","name":"FqvIQ_eHfcyw2PbXkBNjnLwY9l-K","size":3886971,"bucket":"lejia-prod","user_id":2779,"is_video":false,"raw_name":"IMG20181020121310.jpg","created_at":"2018-10-20 19:15:52","updated_at":"2018-10-20 19:15:52","display_name":"IMG20181020121310.jpg"},{"id":3662934,"ext":"video\/mp4","uri":"http:\/\/s.lejias.cn\/o_1cq8j152uri67mf1caif0uqon1p.mp4","host":"http:\/\/s.lejias.cn\/","mime":"video\/mp4","name":"o_1cq8j152uri67mf1caif0uqon1p.mp4","size":84413488,"bucket":"lejia-prod","user_id":2779,"is_video":true,"raw_name":"VID20181020121316.mp4","created_at":"2018-10-20 19:17:48","updated_at":"2018-10-20 19:17:48","display_name":"VID20181020121316.mp4"}],"房屋类型":{"id":420,"name":"公寓"},"报备类型":"房屋质量报备","窗帘备注":"暂无","衣柜备注":"暂无","是否中介单":"是","其他家具家电":"暂无","家电是否齐全":"是","房屋交接是否干净":"是","是否每个房间都有窗帘":"是","是否每个房间都有衣柜":"是","是否每个房间都有床和床垫":"是","家电不齐,房东是否予以配齐":"是","房东予以配齐,配齐所需天数":"暂无"},"score":"null","staffs":{"id":2779,"name":"吴栋梁","phone":"18651097078","ding_user_id":"204855626921567754","avatar":"https:\/\/static.dingtalk.com\/media\/lADPBbCc1rrIWFTNArPNArM_691_691.jpg","is_enable":null,"is_on_job":null,"org":[{"id":269,"name":"杭州余杭临平组","order":1,"parent_id":94,"depth":5,"leader_id":568,"is_leaf":true,"users":22,"ancestors":{"level-third":{"id":94,"name":"杭州一区","ding_department_id":49967128,"order":1,"is_enable":1,"parent_id":93,"leader_id":385,"lft":135,"rgt":160,"depth":4,"py":"hzyq","pinyin":"hangzhouyiqu","created_at":"2017-09-12 11:49:50","updated_at":"2018-11-06 11:33:12","deleted_at":null},"level-second":{"id":93,"name":"杭州分区","ding_department_id":49969168,"order":1,"is_enable":1,"parent_id":331,"leader_id":70,"lft":134,"rgt":195,"depth":3,"py":"hzfq","pinyin":"hangzhoufenqu","created_at":"2017-09-12 11:49:18","updated_at":"2018-11-12 09:17:25","deleted_at":null}},"created_at":"2018-05-01 18:21:38","updated_at":"2018-10-21 08:19:18","deleted_at":null}],"role":[{"id":246,"position_id":54,"name":"market-marketing-officer","display_name":"市场专员","description":"市场专员","created_at":"2018-04-19 13:16:48","updated_at":"2018-04-19 13:16:48"}],"py":"wdl","pinyin":"wudongliang","created_at":"2018-08-20 19:19:41","updated_at":"2018-11-13 10:49:02"}}],"detail":{"house_goods":{"bed":"1","gas":"1","hood":"1个","sofa":"1个","chair":"无","photo":[{"id":3662885,"uri":"http:\/\/s.lejias.cn\/FssDeKmcg4ovmFheGqVW10MDjliV","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":178561,"bucket":"lejia-prod"}},{"id":3662886,"uri":"http:\/\/s.lejias.cn\/FiAGwoxfPP0xgVPBed6So-X79s5K","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":140294,"bucket":"lejia-prod"}},{"id":3662887,"uri":"http:\/\/s.lejias.cn\/FiZcTg0dCNndWvPoDfoIsskrczHC","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3679467,"bucket":"lejia-prod"}},{"id":3662889,"uri":"http:\/\/s.lejias.cn\/FhSxiSWC9510L_GbKCHrZjxGU8NR","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3687037,"bucket":"lejia-prod"}},{"id":3662891,"uri":"http:\/\/s.lejias.cn\/FvpdFMJpvqRkcwGaYc9WMFR3Cv-M","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":2915784,"bucket":"lejia-prod"}},{"id":3662892,"uri":"http:\/\/s.lejias.cn\/Fl0Te9CtAhdQiqy7pfSaJqOuEaxM","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3366664,"bucket":"lejia-prod"}},{"id":3662898,"uri":"http:\/\/s.lejias.cn\/Fpil7dodN-twqYmDSJv31reiu22j","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3589641,"bucket":"lejia-prod"}},{"id":3662901,"uri":"http:\/\/s.lejias.cn\/FqvIQ_eHfcyw2PbXkBNjnLwY9l-K","info":{"ext":"image\/jpeg","host":"http:\/\/s.lejias.cn\/","mime":"image\/jpeg","size":3886971,"bucket":"lejia-prod"}},{"id":3662934,"uri":"http:\/\/s.lejias.cn\/o_1cq8j152uri67mf1caif0uqon1p.mp4","info":{"ext":"video\/mp4","host":"http:\/\/s.lejias.cn\/","mime":"video\/mp4","size":84413488,"bucket":"lejia-prod"}}],"price":"3000元","fridge":"1台","heater":"1","curtain":"1","is_fill":"1","is_clean":"1","wardrobe":"1","gas_stove":"1个","microwave":"1台","television":"1台","clothe_rack":"1个","dining_table":"无","is_lord_fill":"1","other_remark":"无","wash_machine":"1台","water_heater":"1台","air_condition":"1台","other_furniture":"无"},"id":"28378","community":{"area":{"area_id":"330110","area_name":"余杭区"},"city":{"city_id":"330100","city_name":"杭州市"},"region":{"id":188,"region_name":"西溪"},"province":{"province_id":"330000","province_name":"浙江省"},"id":"40641","name":"理想银泰城","address":"雪海路36号附近","nickname":"","detailed_address":"浙江省杭州市余杭区雪海路36号附近"},"area":"52m²","decorate":407,"floor":{"all":42,"this":35},"property_type":{"id":420,"name":"公寓"},"house_feature":"","clean":1,"direction":{"id":1,"name":"东"},"house_type":[1,1,1],"door_address":"10-1-3534(10栋1单元3534室)","is_agency":1,"create_time":"2018-10-20 19:27:45","price":"3000元","staffs":{"id":2779,"name":"吴栋梁","phone":"18651097078","ding_user_id":"204855626921567754","avatar":"https:\/\/static.dingtalk.com\/media\/lADPBbCc1rrIWFTNArPNArM_691_691.jpg","is_enable":null,"is_on_job":null,"org":[{"id":269,"name":"杭州余杭临平组","order":1,"parent_id":94,"depth":5,"leader_id":568,"is_leaf":true,"users":22,"ancestors":{"level-third":{"id":94,"name":"杭州一区","ding_department_id":49967128,"order":1,"is_enable":1,"parent_id":93,"leader_id":385,"lft":135,"rgt":160,"depth":4,"py":"hzyq","pinyin":"hangzhouyiqu","created_at":"2017-09-12 11:49:50","updated_at":"2018-11-06 11:33:12","deleted_at":null},"level-second":{"id":93,"name":"杭州分区","ding_department_id":49969168,"order":1,"is_enable":1,"parent_id":331,"leader_id":70,"lft":134,"rgt":195,"depth":3,"py":"hzfq","pinyin":"hangzhoufenqu","created_at":"2017-09-12 11:49:18","updated_at":"2018-11-12 09:17:25","deleted_at":null}},"created_at":"2018-05-01 18:21:38","updated_at":"2018-10-21 08:19:18","deleted_at":null}],"role":[{"id":246,"position_id":54,"name":"market-marketing-officer","display_name":"市场专员","description":"市场专员","created_at":"2018-04-19 13:16:48","updated_at":"2018-04-19 13:16:48"}],"py":"wdl","pinyin":"wudongliang","created_at":"2018-08-20 19:19:41","updated_at":"2018-11-13 10:49:02"},"department":{"id":269,"name":"杭州余杭临平组","order":1,"parent_id":94,"depth":5,"leader_id":568,"leader":{"id":568,"name":"易思祥","phone":"15168246482","ding_user_id":"155119374525905723","avatar":"https:\/\/static.dingtalk.com\/media\/lADPBbCc1Tt5oJLNAd_NAYA_384_479.jpg","is_enable":null,"is_on_job":null,"py":"ysx","pinyin":"yisixiang","created_at":"2017-12-17 21:11:53","updated_at":"2018-11-13 10:35:52"},"is_leaf":true,"top_org":{"id":9,"name":"营销中心","ding_department_id":27828940,"order":1,"is_enable":1,"parent_id":1,"leader_id":70,"lft":54,"rgt":381,"depth":1,"py":"yxzx","pinyin":"yingxiaozhongxin","created_at":"2017-06-23 12:21:36","updated_at":"2018-11-12 09:17:25","deleted_at":null},"users":22,"ancestors":{"level-third":{"id":94,"name":"杭州一区","ding_department_id":49967128,"order":1,"is_enable":1,"parent_id":93,"leader_id":385,"lft":135,"rgt":160,"depth":4,"py":"hzyq","pinyin":"hangzhouyiqu","created_at":"2017-09-12 11:49:50","updated_at":"2018-11-06 11:33:12","deleted_at":null},"level-second":{"id":93,"name":"杭州分区","ding_department_id":49969168,"order":1,"is_enable":1,"parent_id":331,"leader_id":70,"lft":134,"rgt":195,"depth":3,"py":"hzfq","pinyin":"hangzhoufenqu","created_at":"2017-09-12 11:49:18","updated_at":"2018-11-12 09:17:25","deleted_at":null}},"created_at":"2018-05-01 18:21:38","updated_at":"2018-10-21 08:19:18","deleted_at":null},"rent_end_than_days":"否","total_ready_days":40,"current_ready_days":"\/","is_again_rent":"","lord_remainder_days":1499,"lords":[{"id":27195,"house_id":28378,"contract_number":"LJGYSF030004479","type":1,"first_pay_at":"2018-12-05","second_pay_at":"2019-01-05","sign_month":48,"sign_remainder_day":0,"sign_at":"2018-10-20","start_at":"2018-10-25","end_at":"2022-12-02","end_real_at":null,"end_type":null,"end_handover_id":null,"mortgage_price":"3000.00","penalty_price":"15000.00","ready_days":40,"purchase_way":509,"vacancy_other":"","vacancy_way":438,"vacancy_end_date":"2018-12-03","duration_days":1499,"month_price":[{"price":"3000","period":"48"}],"pay_way":[{"period":"48","pay_way":444}],"pay_account_info":{"bank":"中国建设银行","name":"李知仁","phone":"18258217776","account":"6227002061090207104","subbranch":"江西省新余市城北支行","account_name":"袁娜","relationship":"房东"},"is_joint":null,"is_agency":1,"is_corp":1,"agency_info":{"agency_name":"杭州易杭房地产营销策划有限公司","agency_phone":"13666635746","agency_price":"1200","agency_price_now":"1200","agency_user_name":"张宁波"},"album":{"photo":[3663209,3663210,3765023],"promise":[3696819],"gas_photo":[],"auth_photo":[3765031],"bank_photo":[3696802],"other_photo":[],"water_photo":[3696803],"checkin_photo":[3696808,3696810],"deposit_photo":[3696818],"checkout_photo":[],"gas_card_photo":[],"identity_photo":[3663243,3663244,3663248,3663249,3663250],"property_photo":[3663236,3663237,3663238,3663239,3663240,3663241],"water_card_photo":[],"electricity_photo":[3696805,3696806,3696807],"checkout_settle_photo":[],"electricity_card_photo":[]},"remark_clause":"","remark":"无燃气卡电卡照片    无燃气卡卡号电卡卡号水卡卡号照片   物业充值使用  ","guarantee_days":1501,"property_payer":451,"property_price":null,"user_id":2779,"org_id":269,"sign_user_id":2779,"sign_org_id":269,"city_name":null,"doc_status":{"published":1},"visit_status":{"published":1},"generate_from":null,"created_at":"2018-10-20 19:57:31","updated_at":"2018-11-04 10:10:09","bulletindate":"2018-10-20 19:47:49","submit_time":null,"first_submit":1,"customer_info":[{"py":"lzr","sex":"1","name":"李知仁","phone":"18258217776","idcard":"360502201203171313","idtype":411,"pinyin":"lizhiren"}],"status":2,"sign_org":{"id":269,"name":"杭州余杭临平组"},"sign_user":{"id":2779,"name":"吴栋梁"},"customers":[{"id":54093,"name":"李知仁","phone":"18258217776","sex":1,"idtype":411,"idcard":"360502201203171313","is_corp":0,"is_agent":0,"user_id":null,"org_id":null,"py":"lzr","pinyin":"lizhiren","created_at":"2018-10-29 13:21:48","updated_at":"2018-10-29 13:21:48","pivot":{"id":40915,"customer_id":54093,"lord_id":27195,"created_at":"2018-10-29 13:21:48","updated_at":"2018-10-29 13:21:48"}}]}],"renters":[{"id":37108,"contract_number":"LJGYZF030004753","rentable_id":28378,"rentable_type":"App\\Models\\Houses","type":1,"sign_month":3,"sign_remainder_day":0,"sign_at":"2018-11-07","start_at":"2018-11-08","end_at":"2019-02-07","end_real_at":null,"end_type":null,"end_handover_id":null,"duration_days":91,"month_price":[{"price":"2000","period":"3","price_str":"2000元"}],"mortgage_price":"0.00","money_sum":8000,"money_table":[{"money_sep":"8000","money_way":"渤海银行 6214530251396656 王建林","money_way_str":null}],"penalty_price":null,"purchase_way":null,"pay_bet":1,"pay_way":[{"period":"3","pay_way":"3","pay_way_bet":"1","pay_way_str":"押1付3"}],"pay_account_info":null,"is_joint":0,"is_agency":1,"is_corp":1,"agency_info":{"agency_name":"宜家房产","agency_phone":"13868074339","agency_price":"800","agency_price_now":"800","agency_user_name":"周芳仙"},"album":{"photo":[4015545,4015546,4015548,4015549,4015552,4015553],"deposit_photo":[4015853],"certificate_photo":[4015544]},"remark_clause":null,"remark":"","receipt_number":[],"final_payment_at":"2018-11-07","property_payer":451,"property_price":null,"user_id":3208,"org_id":269,"sign_user_id":3208,"sign_org_id":269,"city_name":null,"doc_status":null,"visit_status":null,"generate_from":null,"created_at":"2018-11-07 20:14:28","updated_at":"2018-11-10 17:15:01","bulletindate":"2018-11-07 19:07:31","submit_time":null,"first_submit":1,"customer_info":[{"name":"丁仁喜","phone":"18574517118","idcard":null,"idtype":null}],"trans_type":-1,"front_money":"0.00","deposit_payed":"2000.00","rent_money":"6000.00","is_receipt":1,"status":2,"sign_org":{"id":269,"name":"杭州余杭临平组"},"sign_user":null,"customers":[]}],"status":1}}}
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.detailData = [];
        this.albumData = [];
        this.albumData = [];
        this.lords = [];
        this.renters = [];
        this.videoArray = [];
        // this.$http.get(globalConfig.server + 'house/album/' + this.$route.query.id).then((res) => {
        //   if (res.data.code === '30070') {
            Toast.clear();
            this.detailData = res.data.data.detail;
            this.albumData = res.data.data.album;
            this.lords = res.data.data.detail.lords;
            this.renters = res.data.data.detail.renters;
            this.videoArray = this.getVideo(res.data.data);
          // } else {
          //
          // }
        // }).catch((error) => {
        //   Toast.fail("详情获取失败！");
        // })
      },
      //筛选视频
      getVideo(data) {
        let videoArray = [];
        if (data.album.length > 0) {
          data.album.forEach((item) => {
            if (item.album.album_file.length > 0) {
              let album = item.album.album_file;
              album.forEach((image) => {
                if (image.info.mime.indexOf('video') > -1) {
                  videoArray.push(image);
                }
              })
            }
          })
        }
        if (data.detail && data.detail.house_goods) {
          let houseGoods = data.detail.house_goods;
          if (houseGoods.photo.length > 0) {
            houseGoods.photo.forEach((image) => {
              if (image.info.mime.indexOf('video') > -1) {
                videoArray.push(image);
              }
            })
          }
        }

        return videoArray;
      },
      //**********************
      onChange(index) {
        this.imgIndex = index + 1;
      },
      router(val, id) {
        if (val == 'img') {
          this.$router.push({path: '/imgDetail', query: {id: id}});
        } else {
          this.$router.push({path: '/contractDetail', query: {id: id}});
        }
      },

      searchCollectDetail(id) {
        this.$router.push({path: '/collectDetail', query: {id: id, from: 'productDetail'}});
      },
      searchRentDetail(id) {
        this.$router.push({path: '/rentDetail', query: {id: id, from: 'productDetail'}});
      },
      showLargePic(images, index) {
        let imgArray = [];
        images.forEach((item) => {
          if (item.info.mime.indexOf('image') > -1) {
            imgArray.push(item.uri);
          }
        });
        this.largePic = ImagePreview(imgArray, index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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

  .flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .banner {
    width: 100%;
    height: 4.2rem;
    position: relative;
    box-sizing: border-box;
    .img {
      img, video {
        width: 100%;
        height: 4.2rem;
      }

    }
    .indicators {
      display: inline-block;
      color: #FFFFFF;
      background: #666;
      border-radius: 4px;
      height: .35rem;
      width: .7rem;
      text-align: center;
      line-height: .35rem;
      position: absolute;
      bottom: .2rem;
      right: .3rem;
      font-size: 0.2rem;
    }
  }

  .mainContent {
    padding: 0 .3rem;
    .content_top {
      padding: .4rem 0 0.3rem 0;
      border-bottom: 1px solid #ddd;
      @extend .flex;
      flex-wrap: wrap;
      .address {
        width: 75%;
        > div {
          padding: .15rem 0;
        }
        h3 {
          span {
            font-size: .38rem;
            font-weight: bold
          }
        }
        .otherInfo {
          span {
            font-size: .2rem;
          }
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 2px;
          margin-right: .1rem;
          font-size: .2rem;
          display: inline-block;
        }
      }
      .rentStatus {
        > div {
          padding: .1rem 0;
        }
        width: 25%;
        @extend .flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: center;
      }
    }

    .content_other {
      color: #777;
      @extend .flex;
      > div {
        flex-grow: 1;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
        margin: .15rem 0;
        border-right: 1px solid #DDDDDD;
        &:last-child {
          border: none;
        }
      }
      border-bottom: 1px solid #DDDDDD;
    }
    .more_detail {
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .row_item {
        padding: .1rem 0;
        .key {
          color: #777;
          text-align: right;
          font-size: .26rem;
        }
        .value {
          text-align: left;
          font-size: .26rem;
        }
      }
    }

    .house_set {
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .title {
        font-weight: bold;
      }
      .house_set_item {
        padding: .15rem 0;
        .key {
          color: #777;
          font-size: .28rem;
        }
        .value {
          font-size: .28rem;
          line-height: 130%;
        }
      }
    }

    .house_img {
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .img_title {
        margin-bottom: .2rem;
        @extend .flex;
        justify-content: space-between;
        .title {
          font-weight: bold;
        }
        .more {
          color: #777;
          font-size: .24rem;
        }
      }
      .imgContent {
        padding: .2rem 0;
        @extend .flex;
        flex-wrap: wrap;
        .imgItem {
          width: 25%;
          text-align: center;
          padding-bottom: .2rem;
        }
      }
    }

    .house_contract {
      padding: .3rem 0;
      .contract_title {
        margin-bottom: .2rem;
        @extend .flex;
        justify-content: space-between;
        .title {
          font-weight: bold;
        }
        .more {
          color: #777;
          font-size: .24rem;
        }
      }
      .contractInfo {
        border-bottom: 1px solid #DDDDDD;
        &:last-child {
          border: none;
        }
        padding: .2rem 0;
        .contractItem {
          padding: .05rem 0;
          .itemWord {
            font-size: .28rem;
            line-height: 130%;
          }
        }
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
      .close {
        position: absolute;
        width: .8rem;
        height: .8rem;
        text-align: center;
        line-height: .8rem;
        @include border_radius(50%);
        /*background-color: rgba(0, 0, 0, .8);*/
        bottom: 1rem;
        /*border: 1px solid rgba(255, 255, 255, .8);*/
        right: 2%;
        top: 2%;
        transform: translate(-50%);
        i {
          color: #FFFFFF;
          font-size: .6rem;
        }
      }
    }
  }


</style>
