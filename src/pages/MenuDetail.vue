<template>
  <div class="menu-detail-container">
    <header-bar class="header-bar" :type="3" :passedMenuId="menuId" :menuList="menuList"></header-bar>
    <div class="menu-detail-flex-box" v-if="isCompleted">
      <div class="menu-detail-top">
        <div class="menu-detail-top-left">
          <p>{{ restaurantName }}</p>
          <p>점심시간 {{ operationTime | timeFilter}}</p>
        </div>
        <!-- <div class="menu-detail-top-right">
          <img src="../assets/icon_share.svg" alt="공유하기"/>
        </div> -->
      </div>

      <div class="menu-detail-middle">
        <div class="menu-detail-middle-image">
          <b-carousel
            id="carousel-fade"
            style="text-shadow: 0px 0px 2px #000"
            fade
            indicators
            :interval=0
          >
            <b-carousel-slide v-for="(slide, index) in slides" :key="index">
              <template v-slot:img>
                <img :src="slide" class="d-block menu-image">
              </template>
            </b-carousel-slide>
          </b-carousel>
        </div>
        <img
          class="favorite-icon"
          :src="favoriteImg"
          @click="changeFavoriteState"
        />
      </div>

      <div class="menu-detail-bottom">
        <div class="menu-detail-bottom-date">
          <div class="menu-detail-bottom-date-menu-type">
            <p>{{ menuType | menuTypeFilter}}</p>
          </div>
          <div class="menu-detail-bottom-date-start-end-date">
            <p>{{ startDate | formatDate(endDate) }}</p>
          </div>
        </div>
        <div class="menu-detail-bottom-contents">
          <p>{{ contents }}</p>
        </div>
        <div class="menu-detail-bottom-info">
          <div class="menu-detail-bottom-info-price">
            <p>{{ price | priceFilter}}</p>
          </div>
          <div class="menu-detail-bottom-info-address">
            <p>{{ restaurantAddress }}</p>
          </div>
          <div class="menu-detail-bottom-info-phone-distance">
            <a v-bind:href="callPhone">{{ restaurantPhone }}</a>
            <span>{{ distance }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/headerBar'
import codeFilter from '../js/codeFilter.js'

export default {
  created() {
    this.menuId = this.$route.params.menuId
    if (this.$store.state.favoriteList.indexOf(this.menuId) != -1) {
      this.isFavorite = true;
    }
    this.getMenuDetail(this.menuId)
    this.getGeoInfo(this)
  },
  components: {
    HeaderBar
  },
  data() {
    return {
      isCompleted: false,
      restaurantName: "종로타워 한식부페 미담",
      operationTime: "10:30 - 14:30",
      menuUserId: undefined,
      price: undefined,
      menuImage: undefined,
      restaurantImage1: undefined,
      restaurantImage2: undefined,
      restaurantImage3: undefined,
      restaurantImage4: undefined,
      restaurantId: undefined,
      menuType: undefined,
      startDate: "2020-01-12",
      endDate: "2020-01-17",
      contents: "6,500원에 맛있는 점심 한 끼 드시고 가세요!!",
      restaurantAddress: "서울시 종로구 종로5길 14-3 파이낸스타워 B1",
      restaurantPhone: "02-2361-3345",
      isFavorite: false,
      menuId: "1",
      gpsX: 0,
      gpsY: 0,
      geoX: 0,
      geoY: 0
    };
  },
  computed: {
    favoriteImg: function() {
      if (this.isFavorite) {
        return require("../assets/icon_favorite_on.svg");
      } else {
        return require("../assets/icon_favorite_off.svg");
      }
    },
    slides: function() {
      if(this.isCompleted) {
        let tempArray = [
          this.menuImage,
          this.restaurantImage1,
          this.restaurantImage2,
          this.restaurantImage3,
          this.restaurantImage4
        ]

        let resArray = []
        tempArray.forEach((value) => {
          if(value) {
            resArray.push(value)
          }
        })

        return resArray
      } else {
        return ["https://picsum.photos/1024/480/?image=12"]
      }
    },
    menuString: function() {
      if(this.menuType == 0) {
        return "일간"
      } else if (this.menuType == 1) {
        return "주간"
      } else if (this.menuType == 2) {
        return "월간"
      } else {
        return "일간"
      }
    },
    distance: function() {
      if(this.gpsX) {
        let targetX = this.gpsX
        let targetY = this.gpsY
        return this.getDistance(this.geoX, this.geoY, targetX, targetY, 'M')
      } else {
        return '알수없음'
      }
    },
    menuList() {
      let menuListArray = [{ menuName : '고객센터', pathName: 'CS' }]

      if(this.userId == this.menuUserId || this.userId == 'admin'){
        menuListArray.unshift({ menuName : '메뉴수정', pathName: 'MenuUpdate' })
      }
      
      return menuListArray
    },
    callPhone(){
      return 'tel:' + this.restaurantPhone
    },
  },
  methods: {
    changeFavoriteState: function() {
      if (this.isFavorite) {
        this.$store.commit("deleteFavoriteRes", this.menuId);
      } else {
        this.$store.commit("addFavoriteRes", this.menuId);
      }

      this.isFavorite = !this.isFavorite;
    },
    getMenuDetail: function(menuId) {
      let params = {
        menuId : menuId
      }

      this.$api.menuDetail(params, this.token)
      .then(response => {
        switch(response.data.errCode) {
          case 200: {
            this.mapResult(response.data)
            break;
          }
          case 400: {
            alert(response.data.msg)
            this.$router.go(-1)
            break;
          }
          case 401: {
            alert('로그인 해주세요  ͡~ ͜ʖ ͡° ')
            this.$router.replace({name: 'Login'})
            break;
          }
          default: {
            alert('server error: ', response.data.msg)
            this.$router.go(-1)
            break;
          }
        }
      })
      .catch(error => {
        console.log('network error : ', error)
      })
    },
    mapResult: function(result) {
      this.menuUserId = result.userId,
      this.price = result.price,
      this.menuImage = result.menuImage,
      this.contents = result.contents,
      this.menuType = result.menuType,
      this.startDate = result.startDate,
      this.endDate = result.endDate,
      this.restaurantName = result.restaurantName,
      this.restaurantAddress = result.restaurantAddress,
      this.restaurantPhone = result.restaurantPhone,
      this.operationTime = result.operationTime,
      this.restaurantImage1 = result.restaurantImage1,
      this.restaurantImage2 = result.restaurantImage2,
      this.restaurantImage3 = result.restaurantImage3,
      this.restaurantImage4 = result.restaurantImage4,
      this.restaurantId = result.restaurantId,
      this.gpsX = Number(result.gpsX),
      this.gpsY = Number(result.gpsY),
      this.isCompleted = true
    },
    getGeoInfo: function(that) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition (function(pos) {
          that.geoX = pos.coords.latitude;
          that.geoY = pos.coords.longitude;
        });
      } else {
          alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
      }
    },
    getDistance: function(lat1, lon1, lat2, lon2, unit) {
      if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
      }
      else {
        let radlat1 = Math.PI * lat1/180;
        let radlat2 = Math.PI * lat2/180;
        let theta = lon1-lon2;
        let radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="M") { dist = dist * 1.609344 * 1000}
        if (unit=="N") { dist = dist * 0.8684 }

        if(dist > 1000) {
          return `${(dist / 1000).toFixed(1)}K 이내`
        } else {
          return `${dist.toFixed(0)}M 이내`
        }
      }
    },
  },
  filters: {
    formatDate: function(startDate, endDate) {
      return startDate + " ~ " + endDate;
    },
    priceFilter(val){
      let num = new Number(val);
      return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + " 원"
    },
    timeFilter(val){
        return val.substring(0,2) + ':' + val.substring(2,4) + '~' + val.substring(4,6) + ":"  + val.substring(6,8)
    },
    menuTypeFilter: codeFilter.menuType
  },
}
</script>

<style lang="scss" scoped>
.menu-detail-container {
  .menu-detail-flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 25px;
    background-color: #f9f9f9;

    .menu-detail-top {
      position: relative;
      display: flex;
      flex-direction: row;
      width: 100%;

      .menu-detail-top-left {
        width: calc(100% - 30px);

        p {
          display: block;
          margin: 0px;
        }
        p:first-child {
          font-size: 26px;
          color: #000000;
          letter-spacing: 0.65px;
          font-weight: bold;
          margin-bottom: 10px;
        }
      }
      .menu-detail-top-right {
        align-self: center;
        width: 30px;
        height: 30px;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .menu-detail-middle {
      width: 100%;
      height: 300px;
      background-color: #ffffff;
      margin-top: 20px;
      position: relative;

      .menu-detail-middle-image {
        .menu-image {
          width: 100%;
          height: 300px;
        }
      }
      .favorite-icon {
        z-index: 100;
        position: absolute;
        width: 30px;
        height: 30px;
        top: 10px;
        left: 10px;
      }
    }
    .menu-detail-bottom {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      width: 100%;
      background-color: #ffffff;

      .menu-detail-bottom-date {
        display: flex;
        flex-direction: row;
        margin: 20px 10px;
        background-color: #f4f0f0;
        border-radius: 17px;

        div {
          padding: 6px 10px;
        }
        p {
          margin: 0;
        }
        .menu-detail-bottom-date-menu-type {
          width: 74px;
          background-color: #cf5252;
          border: 1px solid #70707000;
          border-radius: 17px;

          p {
            font-size: 22px;
            color: #ffffff;
            text-align: center;
          }
        }
        .menu-detail-bottom-date-start-end-date {
          width: 100%;
          p {
            font-size: 17px;
            letter-spacing: 0.2px;
            line-height: 35px;
            position: absolute;
          }
        }
      }
      .menu-detail-bottom-contents {
        margin: 0 20px;

        p {
          color: #040404;
          font-size: 18px;
        }
      }
      .menu-detail-bottom-info {
        text-align: right;
        margin: 20px;

        p {
          margin: 0;
        }
        .menu-detail-bottom-info-price {
          margin-bottom: 10px;

          p {
            font-size: 20px;
            font-weight: bold;
            color: #000000;
          }
        }
        .menu-detail-bottom-info-address {
          margin-bottom: 10px;

          p {
            color: #828282;
            font-size: 20px;
          }
        }
        .menu-detail-bottom-info-phone-distance {
          a:link , a:visited , a:hover {
            color: #cf5252;
            text-decoration: none;
          }
          span, a {
            font-size: 18px;
            font-weight: bold;
          }
          span {
            margin-left: 10px;
            color: #642A02;
          }
        }
      }
    }
  }
}
</style>
