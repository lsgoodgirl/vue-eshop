<template>
<div class="order" v-if="productInfo !== null">
  <!-- header -->
  <mt-header :title="$t('buy.confirmOrder')">
    <router-link to="/" slot="left">
      <mt-button icon="back"></mt-button>
    </router-link>
  </mt-header>

  <div class="orderBox">
    <div class="orderBoxGoods">
      <div class="i-img">
        <p><img :src="image + productInfo.Slide[productInfo.Slide.length-1].goods_slide_url" /></p>
      </div>
      <div class="orderInfo">
        <h5>{{ productInfo.Goods.goods_name }}</h5>
        <p>{{ productInfo.Goods.goods_name }}</p>
      </div>
      <div class="orderNum">
        <span class="price" id="111">
          <span>{{ productInfo.Goods.discount_price }}</span>
          {{ $t("index.productTaxM") }}
        </span>
        <span id="goodsNum">× {{ goodsNum }}</span>
      </div>
    </div>
  </div>

  <div id="goodsStandard">
    <ul class="productImg" v-for="sd in sdGroup" :key="sd.sd_id">
      <label class="label-top" style="display: block;">{{ sd.sd_view_name }}:</label>
      <li v-for="value_group in sd.sd_value_group"  @click="onSelectSd(sd.sd_id, value_group.sd_value_id)" :key="value_group.sd_value_id" :class="{ selected: value_group.sd_value_id === selectedSd[sd.sd_id] }">
        <div v-if="value_group.sd_value_image" >
          <a href="javascript:;" :title="value_group.sd_value_id">
            <img :src="image + value_group.sd_value_image">
          </a>
          <span>{{ value_group.sd_value_name }}</span>
        </div>
        <div v-else>
          <a href="javascript:;" :title="value_group.sd_value_id">
            <span>{{ value_group.sd_value_name }}</span>
          </a>
        </div>
      </li>
    </ul>
  </div>

  <div class="numberRight"> {{ $t("buy.buyNotice") }} </div>

  <div class="numberRight">
    <div class="numberBox">
      <button class="mui-numbox-btn-minus" type="button" v-on:click="goodsNum > 1 ? goodsNum -= 1 : 1">-</button>
      <input class="mui-numbox-input" type="number" v-model="goodsNum" readonly>
      <button class="mui-numbox-btn-plus" type="button" v-on:click="goodsNum < 99 ? goodsNum += 1 : 99">+</button>
    </div>
    <label class="numberLable"><span class="require">*</span>{{ $t("buy.goodsNum") }} : </label>
  </div>

  <mt-field :label="$t('buy.trueName')" :state="errors.has('trueName') ? 'error' : ''" v-model="trueName" name="trueName" v-validate="'required'"></mt-field>
  <span v-show="errors.has('trueName')">{{ errors.first('trueName') }}</span>

  <mt-field :label="$t('buy.zipCode')" :state="errors.has('zipCode') ? 'error' : ''" v-model="zipCode" name="zipCode" v-validate="'required'"></mt-field>
  <span v-show="errors.has('zipCode')">{{ errors.first('zipCode') }}</span>

  <mt-field :label="$t('buy.provinceId')" :state="errors.has('provinceId') ? 'error' : ''" v-model="provinceId" name="provinceId" v-validate="'required'" @click.native="popupVisible = true"></mt-field>
  <span v-show="errors.has('provinceId')">{{ errors.first('provinceId') }}</span>
  <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
    <mt-picker :slots="provinceGroup" @change="onProvinceChange"></mt-picker>
  </mt-popup>

  <mt-field :label="$t('buy.cityId')" :state="errors.has('cityId') ? 'error' : ''" v-model="cityId" name="cityId" v-validate="'required'"></mt-field>
  <span v-show="errors.has('cityId')">{{ errors.first('cityId') }}</span>

  <mt-field :label="$t('buy.address')" :state="errors.has('address') ? 'error' : ''" v-model="address" name="address" v-validate="'required'"></mt-field>
  <span v-show="errors.has('address')">{{ errors.first('address') }}</span>

  <mt-field :label="$t('buy.telPhone')" :state="errors.has('telPhone') ? 'error' : ''" v-model="telPhone" name="telPhone" v-validate="'required'"></mt-field>
  <span v-show="errors.has('telPhone')">{{ errors.first('telPhone') }}</span>

  <mt-field :label="$t('buy.email')" :state="errors.has('email') ? 'error' : ''" v-model="email" name="email" v-validate="'required|email'"></mt-field>
  <span v-show="errors.has('email')">{{ errors.first('email') }}</span>

  <mt-field :label="$t('buy.orderMessage')" name="orderMessage" :placeholder="$t('buy.orderMessage_placeholder')"></mt-field>

  <mt-field :label="$t('buy.pay')" :value="productInfo.Goods.extend_fee_value"></mt-field>

  <div class="line">
    <span>{{ $t("buy.line1") }}</span>
    <span class="mun" id="totalNum"> {{ goodsNum }} </span>
    <span>{{ $t("buy.line2") }}</span>

    <span>{{ $t("buy.line3") }}:</span>
    <span class="price">
      <span class="buyinfo_table_red">
        <span id="totalMoney"> {{ OrderAmount }} </span>{{ $t("index.productTaxM") }}
      </span>
    </span>
  </div>
  <br />

  <mt-button type="danger" size="large" @click.native="doBuy">{{ $t("buy.buyNow") }}</mt-button>
  <br />
  <div v-html="$t('buy.bottomTipNote')"></div>
</div>
</template>

<script>
import Vue from 'vue'
import api from '../api'
import location from '../assets/js/location'
import { mapGetters, mapActions } from 'vuex'
import { Field, Header, Button, Popup, Picker } from 'mint-ui'
import { Validator } from 'vee-validate'

Vue.component(Field.name, Field)
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)

const dictionary = {
  ja: {
    attributes: {
      trueName: 'お名前',
      zipCode: '郵便番号',
      provinceId: '都道府県',
      cityId: '市区町村',
      address: '建物名',
      telPhone: '電話番号',
      email: 'Email',
      orderMessage: 'メッセージ'
    }
  },
  zh_HK: {
    attributes: {
      trueName: 'Full name',
      zipCode: 'Postal Code',
      provinceId: 'District',
      cityId: 'Municipalities',
      address: 'Address Details',
      telPhone: 'Phone Number',
      email: 'Email',
      orderMessage: 'Comments'
    }
  },
  ms_MY: {
    attributes: {
      trueName: 'Full name',
      zipCode: 'Postal Code',
      provinceId: 'State',
      cityId: 'Municipalities',
      address: 'Address Details',
      telPhone: 'Phone Number',
      email: 'Email',
      orderMessage: 'Comments'
    }
  },
  zh_TW: {
    attributes: {
      trueName: '姓名',
      zipCode: '郵遞區號',
      provinceId: '縣市',
      cityId: '詳細地址',
      address: '詳細地址',
      telPhone: '電話號碼',
      email: 'Email',
      orderMessage: '留言'
    }
  }
}
Validator.localize(dictionary)

export default {
  name: 'Order',
  data () {
    return {
      api: process.env.API_SERVER,
      image: process.env.IMG_SERVER,
      popupVisible: false,
      selectedSd: {},
      goodsNum: 1,
      trueName: '',
      zipCode: '',
      provinceId: '',
      cityId: '',
      areaId: '#',
      address: '',
      telPhone: '',
      email: '',
      orderMessage: ''
    }
  },
  computed: {
    ...mapGetters({
      Product: 'Product'
    }),
    ...mapActions({
      InitProduct: 'InitProduct'
    }),
    productInfo () {
      return this.Product
    },
    countryId: function () {
      let countryMap = {
        'xmetadata.com': 'JP',
        'etlobby.com': 'JP',
        'fitanow.com': 'HK',
        'hiqushop.com': 'TW',
        'couposhop.com': 'MY'
      }
      let host = process.env.NODE_ENV === 'production' ? window.location.host : process.env.HOST
      return countryMap[host.match(/(\w+)\.(\w+\.\w+)/)[2]]
    },
    OrderAmount () {
      return Number(this.productInfo.Goods.discount_price * this.goodsNum) + Number(this.productInfo.Goods.extend_fee_value)
    },
    sdInfo () {
      let temp = ''
      for (let key in this.selectedSd) {
        if (temp === '') {
          temp = key + '##' + this.selectedSd[key]
        } else {
          temp += '&&' + key + '##' + this.selectedSd[key]
        }
      }
      return temp
    },
    sdGroup () {
      let productInfo = this.Product
      let temp = []
      for (let j = 0; j < productInfo.Standard.length; j++) {
        let outer = false
        let sdItem = productInfo.Standard[j]
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].sd_id === sdItem.sd_id) {
            temp[i].sd_value_group.push({'sd_value_id': sdItem.sd_value_id,
              'sd_value_image': sdItem.sd_value_image,
              'sd_value_name': sdItem.sd_value_name,
              'sd_value_sort': sdItem.sd_value_sort})
            outer = true
            break
          }
        }
        if (outer) {
          continue
        }
        temp.push({'sd_id': sdItem.sd_id,
          'sd_name': sdItem.sd_name,
          'sd_view_name': sdItem.sd_view_name,
          'sd_format': sdItem.sd_format,
          'sd_value_group': [{'sd_value_id': sdItem.sd_value_id,
            'sd_value_image': sdItem.sd_value_image,
            'sd_value_name': sdItem.sd_value_name,
            'sd_value_sort': sdItem.sd_value_sort}
          ]})
      }
      return temp
    },
    provinceGroup () {
      let locationMap = {
        'xmetadata.com': location.JP,
        'etlobby.com': location.JP,
        'fitanow.com': location.HK,
        'hiqushop.com': location.TW,
        'couposhop.com': location.MY
      }
      let host = process.env.NODE_ENV === 'production' ? window.location.host : process.env.HOST
      return locationMap[host.match(/(\w+)\.(\w+\.\w+)/)[2]]
    }
  },
  created: function () {
    this.$store.dispatch('InitProduct')
  },
  methods: {
    doBuy: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let data = {
            countryId: this.countryId,
            goodsId: this.productInfo.Goods.goods_id,
            sdGroupId: this.productInfo.Goods.sd_group_id,
            sdInfo: this.sdInfo,
            goodsNum: this.goodsNum,
            goodsAmount: this.productInfo.Goods.discount_price,
            OrderAmount: this.OrderAmount,
            trueName: this.trueName,
            zipCode: this.zipCode,
            provinceId: this.provinceId,
            cityId: this.cityId,
            areaId: this.areaId,
            address: this.address,
            telPhone: this.telPhone,
            email: this.email,
            orderMessage: this.orderMessage
          }
          console.log(data)
          api.createOrder(data).then(function (response) {
            console.log(response.data.result)
          })
            .catch(function (error) {
              console.log(error.response.data)
              console.log(error.response.status)
            })
        }
      })
    },
    onProvinceChange: function (picker, values) {
      this.provinceId = values[0]
    },
    onSelectSd: function (sdId, sdValueId) {
      this.$set(this.selectedSd, sdId, sdValueId)
      console.log(this.selectedSd)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mint-header {background-color: #be0000;}
.mint-popup-4 {width: 100%;}
</style>
