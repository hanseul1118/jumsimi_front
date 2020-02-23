<template>
  <div class="loading-container">
    <div class="loading-inner">
        <div id='mask' v-show="loading" >
            <img id="loadingImg" v-show="loading" src="../assets/loadingBar.gif" />
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    created(){      
      window.addEventListener('resize', this.handleResize)
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    data(){
      return {
        maskWidth : 0,
        maskHeight : 0
      }
    },
    props:{
      loading:{
        type: Boolean,
        default: false,
        required: false
      }
    },
    watch:{
      loading : function(val){
        if(val){
          this.loadingMask()
         
        }
      }
    
    },
    methods:{
      handleResize() {
        this.maskWidth = window.innerWidth;
        this.maskHeight = window.innerHeight;
        // console.log("어플리케이션 width : " , this.maskWidth)
        // console.log("어플리케이션 height : " , this.maskHeight)
      },
      loadingMask() {
        this.appHeight = document.getElementById('app').scrollHeight;
        // console.log("로딩마스크 height : " ,this.maskHeight)
        // console.log("로딩마스크 width : ",this.appHeight)
        document.getElementById('mask').style.width = this.maskWidth + 'px'
        document.getElementById('mask').style.height = this.appHeight + 'px'
        document.getElementById('mask').style.opacity = '0.3'
        document.getElementById('loadingImg').style.top = (this.maskHeight - 200 )/2 + 'px'
        document.getElementById('loadingImg').style.left = (this.maskWidth - 200 )/2 + 'px'
      },
    }
  }
</script>

<style lang="scss">

.loading-container {
  .loading-inner{
      #mask{
        position:absolute;
        z-index:9000; 
        background-color:#cccccc; 
        left:0; 
        top:0;

        #loadingImg{
            position : absolute; 
        }
      }
  }
}
</style>
