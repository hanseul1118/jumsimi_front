import axios from 'axios'

let API_URL = process.env.VUE_APP_API_ENDPOINT

const API = {
  // 1. 메뉴 리스트
  menuList (request, token) {
    let url = `${API_URL}/api/cus/menu`
    let headers = { 
      Authorization: token
    }

    return axios.get(url, { params : request, headers: headers  })
  },
  // 2. 메뉴 상세 (가게 정보 포함)
  menuDetail (request, token) {
    let url = `${API_URL}/api/cus/menudetail`
    let headers = { 
      Authorization: token
    }

    return axios.get(url, { params: request, headers: headers })
  }
}

export default API
