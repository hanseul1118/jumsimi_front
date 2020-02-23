import Vue from "vue"

// 모듈
import Router from "vue-router"
import { store } from './store/store'

// 화면
import MenuList from "@/pages/MenuList.vue"
import MenuDetail from "@/pages/MenuDetail.vue"
import CS from "@/pages/common/CS.vue"

// import api from "@/api/api.js"
Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Main",
            component: MenuList
        },
        { 
            path: "/menulist",
            name: "MenuList",
            component: MenuList
        },
        { 
            path: "/menudetail/:menuId",
            name: "MenuDetail",
            component: MenuDetail
        },
        { 
            path: "/cs",
            name: "CS",
            component: CS
        },
    ]
})
router.beforeEach((to, from, next) => {
    /*eslint no-extra-boolean-cast: "off"*/
    if(to.name == "Login"){
        next()
        return;
    }
    if (!!store.state.userInfo || !!store.state.userInfo.token) {
        next()
    } else {
        next({ name: "Login", params: to.params })
        console.log('before routing, token is undefined')
    }
})

export default router