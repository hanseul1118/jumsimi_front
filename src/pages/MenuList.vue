<template>
  <div class="restaurant-list-container">
    <header-bar :type="2" :menuList="headerList"></header-bar>
    <div class="restaurant-list-body">
      <div v-for="(item, index) in menuList" class="restaurant-list-card" :key="index" >
        <div class="card-left" @click="likeClick(item)">
          <!-- <img class="card-like" > -->
          <img class="card-img" :src="item.originalImage1">
          <img
          class="favorite-icon"
          :src="item.isFavorite? favoriteOnImg : favoriteOffImg"
          />
        </div>
        <div class="card-right" @click="goDetail(item.menuId)"> 
          <div class="restaurant-top">
            <div class="restaurant-name">{{item.restaurantName}}</div>
            <div class="restaurant-type">{{item.menuType | menuTypeFilter}}</div>
          </div>
          <div class="restaurant-text">
            {{item.contents}}
          </div>
          <div class="restaurant-price">{{item.price | priceFilter}}</div>
          <div class="restaurant-bottom">
            <div class="restaurant-lunch-time">점심시간 {{item.lunchOperationTime | timeFilter}}</div>
            <!-- <div class="restaurant-distance">{{item.distance}}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderBar from '../components/headerBar'
  import codeFilter from '../js/codeFilter.js'

  export default {
    created() {  
      this.addScrollEvent();
      this.getMenuList();
      this.getGeoInfo(this);
    },
    destroyed() {
      this.removeScrollEvent();
    },
    components : {
      HeaderBar
    },   
    data(){
      return{
        favoriteOffImg: require('../assets/icon_favorite_off.svg'),
        favoriteOnImg: require('../assets/icon_favorite_on.svg'),
        menuList: [{
          menuId: '',
          restaurantName: '',
          menuType: '',
          contents: '' ,
          lunchOperationTime: '',
          distance: '',
          price: 0,
          isFavorite: false,
          geoX: 0,
          geoY: 0
        }],
        pageCnt: 10,
        pageNumber: 0,
        bottomYN: false,
        isMorePost: true,
      }
    },
    filters:{
      priceFilter(val){
        let num = new Number(val);
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") + " 원"
      },
      timeFilter(val){
        return val.substring(0,2) + ':' + val.substring(2,4) + '~' + val.substring(4,6) + ":"  + val.substring(6,8)
      },
      menuTypeFilter: codeFilter.menuType
    },
    methods:{
      likeClick(data){
        data.isFavorite = !data.isFavorite;
        
        if (data.isFavorite) {
            this.$store.commit("addFavoriteRes", data.menuId);
        } else {
            this.$store.commit("deleteFavoriteRes", data.menuId);
        }
      },
      goDetail(id){
        this.$router.push({ name : "MenuDetail" , params:{menuId : id}})
      },
      getMenuList() {
        // 페이지 증가
        this.pageNumber++;

        if(this.pageNumber == 1){
          this.menuList = [];
        }

        let params = {
          pageCnt : this.pageCnt,
          pageNumber: this.pageNumber
        }

        // restaurant 리스트 불러오기
        this.$api.menuList(params, this.token)
        .then(response => {
          if(response.data.errCode == 200) {
            let result = response.data.menuList;

            // 더보기 할 때 object 병합
            let origin = this.menuList;
            this.menuList = [];
            this.menuList = origin.concat(result);

            // 더보기 가능한 restaurant 존재 여부 저장
            if (result.length < this.pageSize) {
                this.isMorePost = false;
            }

            // 좋아요 리스트 가져오기
            this.getFavoriteList()
          }
        })
        .catch(error => {
          console.log('error : ',error)
        })
      },
      getFavoriteList(){
        for (let index = 0; index < this.menuList.length; index++) {
          if (this.$store.state.favoriteList.indexOf(this.menuList[index].menuId) != -1) {
            this.$set(this.menuList[index], 'isFavorite', true)
          } else {
            this.$set(this.menuList[index], 'isFavorite', false)
          }
        }
      },
      // 스크롤이 bottom 에 도달여부 체크
      bottomVisible() {
        let actionPoint = 300; // 더보기 기능 동작할 스크롤 위치
        let scrollY = window.pageYOffset;
        let visible = document.documentElement.clientHeight;
        let pageHeight = document.documentElement.scrollHeight;
        let bottomOfPage = visible + scrollY + actionPoint >= pageHeight;
        return bottomOfPage || pageHeight < visible + actionPoint;
      },
      // 스크롤이 바닥에 도달하기 전에 더보기 이벤트 제거
      addScrollEvent() {
        window.addEventListener("scroll", () => {
          // menuList 가 있고, 더 불러올 post가 있을 때
          if (this.menuList.length > 0 && this.isMorePost) {
              this.bottomYN = this.bottomVisible();
          }
        });
      },
      // 스크롤이 바닥에 도달하기 전에 더보기 이벤트 제거
      removeScrollEvent() {
        window.removeEventListener("scroll", () => {
          if (this.postList.length > 0 && this.isMorePost) {
          this.bottomYN = this.bottomVisible();
          }
        });
      },
      getGeoInfo(that) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition (function(pos) {
            that.geoX = pos.coords.latitude;
            that.geoY = pos.coords.longitude;
          });
        } else {
          alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
        }
      },
      getDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
          return 0;
        } else {
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
      }
    },
    watch:{
      bottomYN(val) {
        if (val) {
          this.getMenuList();
        }
      }
    },
    computed:{
      distance(){
        if(this.gpsX) {
          let targetX = this.gpsX
          let targetY = this.gpsY
          return this.getDistance(this.geoX, this.geoY, targetX, targetY, 'M')
        } else {
          return '알수없음'
        }
      },
      headerList(){
        let headerArray = [{ menuName : '고객센터', pathName: 'CS' }]
        return headerArray
      }
    }
  }
</script>

<style lang="scss" scoped>
.restaurant-list-container{
  .restaurant-list-body{
    .restaurant-list-card{
      height: 150px;
      clear: both;
      background-color: #F3F3F3;
      margin-bottom: 20px;    
      .card-left{
        width: 154px;
        float: left;
        text-align: center;
        margin: 12px 0;
        position: relative;
        .card-img {
          width: 124px;
          height: 125px;
          margin: auto;
        }
        .favorite-icon {
          z-index: 100;
          position: absolute;
          width: 30px;
          height: 30px;
          top: 4px;
          left: 19px;
        }
      }
      .card-right{
        display: inline-flex;
        flex-direction: column;
        margin-top: 12px;
        margin-right: 15px;
        width: calc(100% - 169px);
        height: 125px;
        .restaurant-top{
          display: flex;
          .restaurant-name{
            color: #000000;
            font-size: 18px;
            font-weight: bold;
            flex: 1;
            text-decoration: none;
            color: #333;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .restaurant-type{
            width: 40px;
            background-color: #EF532E;
            text-align: center;
            border-radius: 12px;
            padding: 3px;
            color: #FFFFFF;
            font-size: 14px;
          }
        }
        .restaurant-text{
          clear: both;
          margin-top: 13px;
          font-size: 14px;
          color: #EF532E;
          height: 37px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 19px;
        }
        .restaurant-price{
          font-size: 18px;
          font-weight: bold;
          position: relative;
          flex: 1;
          align-items: flex-end;
        }
        .restaurant-bottom{
          display: flex;
          align-items: flex-end;
          flex: 1;
          position: relative;
          .restaurant-lunch-time{
            font-size: 14px;
            flex: 1;
          }
          .restaurant-distance{
            color: #EF532E;
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>