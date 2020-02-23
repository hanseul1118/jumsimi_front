<template>
    <div class="cs-container">
        <header-bar :type="1"></header-bar>
        <div class="cs-body">
            <div class="sub-title">점심이 고객센터</div>
            <div class="sub-content">점심이에 관한 문의 사항이 있으면<br>아래 연락처로 연락주세요!</div>
            <div class="cs-img-container">
                <img src="@/assets/cs_call_img.png">
            </div>
            <div class="cs-email">{{ email }}</div>
            <div class="cs-phone">{{ phone }}</div>
        </div>
    </div>
</template>

<script>
    import HeaderBar from '@/components/headerBar.vue'

    export default {
        data(){
            return{
                email:'cs@pickapick.io',
                phone: '010-9936-7110'
            }
        },
        components: {
            HeaderBar
        }
    }
</script>

<style lang="scss" scoped>
.cs-container{
    .cs-body{
        margin-top: 124px;
        text-align: center;
    }
    .sub-title{
        font-size:30px;
        color: #707070;
    }
    .sub-content{
        width: 360px;
        margin: auto;
        margin-top: 40px;
        font-size: 23px;
        color: #A2A2A2;
    }
    .cs-img-container{
        margin: 40px auto;
        width: 176px;
        height: 180px;

        img{
            width: 100%;
            height: 100%;
        }
    }
    .cs-email{
        font-size: 30px;
        color: #707070;
    }
    .cs-phone{
        margin-top: 11px;
        font-size: 30px;
        color: #707070;        
    }

}
</style>