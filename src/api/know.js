import request from '@/utils/request'
const group_name = 'know'
const api_name = 'know'
export default{
    search(page, size, searchMap){
        return request({
            url: `/${group_name}/${api_name}/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    saveKnow(data){
        return request({
            url: `/${group_name}/${api_name}/`,
            method: 'put',
            data: data
        })
    },

    // 修改动态状态
    changeStateById(id,state){
        return request({
            url: `/${group_name}/${api_name}/${id}/${state}`,
            method: 'put'
        })
    },

    getKnowContentById(id){
        return request({
            url: `/${group_name}/${api_name}/${id}`,
            method: 'get'
        })
    },

    commitKnowContent(id,content){
        return request({
            url: `/${group_name}/${api_name}/content/${id}`,
            method: 'put',
            data: content
        })
    },
    
    setHot(id){
        return request({
            url: `/${group_name}/${api_name}/hot/${id}`,
            method: 'put',
        })
    }


}