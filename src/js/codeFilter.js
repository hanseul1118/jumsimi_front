const codeFilter = {
    menuType(codeVal){
        if (codeVal === "01") {
            return "매일"
        } else if (codeVal === "02") {
            return "주간"
        } else if (codeVal === "03") {
            return "월간"
        } else {
            return "기타"
        }
    }
}

export default codeFilter
