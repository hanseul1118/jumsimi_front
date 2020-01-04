import Vue from "vue"

// 모듈
import Router from "vue-router"
// import { store } from "./store/store"

// 화면
import RestaurantList from "@/pages/RestaurantList.vue"
import RestaurantMap from "@/pages/RestaurantMap.vue"
import MenuDetail from "@/pages/MenuDetail.vue"
import CustomerCS from "@/pages/common/CS.vue"

// import api from "@/api/api.js"
Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [
        { 
            path: "/map",
            name: "RestaurantMap",
            component: RestaurantMap
        },
        { 
            path: "/restaurantlist",
            name: "RestaurantList",
            component: RestaurantList
        },
        { 
            path: "/menudetail/:menuId",
            name: "MenuDetail",
            component: MenuDetail
        },
        { 
            path: "/cs",
            name: "CustomerCS",
            component: CustomerCS
        }
    ]
})

    export default router