<template>
    <div class="bottom-bar">
        <div v-show="type == 1" @click="goRestaurantMap">
            지도뷰로 보기
        </div>
        <div v-show="type == 2" @click="goMenuList">
            리스트로 보기
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            type:{
                type : Number,
                default : 0,
                required : false
            }
        },
        methods:{
            goRestaurantMap(){

            },
            goMenuList(){
                
            }
        }
    }
</script>

<style lang="scss" scoped>
    
</style>