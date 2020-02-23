<template>
  <div class="header-menu-container">
    <div class="header-menu-inner">
      <div class="header-top">
        <div class="back-btn" @click="goBack()" v-show="type == 1 || type == 3">
          뒤로
        </div>
        <div class="header-txt" @click="goMenuList()">
          점심이
        </div>
        <div v-show="type == 2 || type == 3" class="header-menu-img-container">
          <img src="@/assets/icon_header_menu.svg" @click="menuClick = !menuClick" />
        </div>
      </div>
      <div v-show="(type == 2 || type == 3) && menuClick" class="header-menu">
        <div>
          <div v-for="(item, index) in menuList" :key="index" class="header-sub-menu" @click="emitFuncion(item.pathName)">
            <img src="@/assets/menu_dot.png" />
            {{ item.menuName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        menuClick : false
      }
    },
    props:{
      type:{
        /**
         *  0:타이틀
         *  1:타이틀 + 뒤로가기 버튼
         *  2:타이틀 + 메뉴 버튼
         *  3:타이틀 + 뒤로가기 + 메뉴 버튼 */
        type: Number,
        default: 0,
        required: false
      },
      passedMenuId: {
        type: String,
        default: undefined,
        required: false
      },
      menuList: {
        type: Array,
        required: false
      }
    },
    methods:{
      goBack(){
        switch(this.$route.name){
          case 'MenuDetail ':
            this.$router.push({name: 'MenuList'})
            break;
          default:
            history.go(-1);
        }
      },
      goMenuList(){
        if(this.$route.name !== 'MenuList') this.$router.push({name: 'MenuList'})
      },
      emitFuncion(pathName){
        if(this.passedMenuId) {
          this.$router.push({ name: pathName, props: { menuId: this.passedMenuId } })
        }else{
          this.$router.push({ name: pathName })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

.header-menu-container {
    position: relative;
    height: 58px;

  .header-menu-inner{
    position: fixed;
    background-color: white;
    width: 100%;
    z-index: 101;
    height: 58px;
  }

  .header-top {
    border-bottom: 1px solid #cccccc;
    height: 58px;


    .back-btn {
      position: absolute;
      top: 17px;
      left: 14px;
      cursor: pointer;
      color: #828282;
      font-size: 20px;
    }
    .header-txt {
      font-size: 38px;
      line-height: 58px;
      text-align: center;
      color: #f65130;
      font-family: "Hi Melody", cursive;
      cursor: pointer;
      width: fit-content;
      margin: auto;
    }
    .header-edit {
      position: absolute;
      top: 17px;
      left: calc(100% - 50px);
      cursor: pointer;
      color: #828282;
      font-size: 20px;
    }
    .header-menu-img-container {
      width: 18px;
      height: 11px;
      position: absolute;
      top: 15px;
      right: 15px;
      img {
        width: 18px;
        height: 11px;
        cursor: pointer;
      }
    }
  }

  .header-menu {
    width: 100%;
    height: auto;
    position: absolute;
    z-index: 101;

    .header-sub-menu {
      background: white;
      width: 100%;
      color: #707070;
      font-size: 23px;
      padding: 13px 38px;
      cursor: pointer;
      img {
        width: 7px;
        padding-bottom: 6px;
      }
      border-bottom: 1px solid #efefef;
    }

    .header-sub-menu:last-child {
      border-bottom: 0px;
    }
  }
}
</style>
