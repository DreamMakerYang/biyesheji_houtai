import request from '@/utils/request'
const group_name = 'dynamic'
const api_name = 'dynamic'
export default{
    search(page, size, searchMap){
        return request({
            url: `/${group_name}/${api_name}/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    getDynamicById(id){
        return request({
            url: `/${group_name}/${api_name}/${id}`,
            method: 'get'
        })
    },

    getCommentById(id){
        return request({
            url: `/${group_name}/${api_name}/comment/${id}`,
            method: 'get'
        })
    },

    deleteCommentByIds(ids){
        return request({
            url: `/${group_name}/${api_name}/comment`,
            method: 'delete',
            data: ids
        })
    },

    // 修改动态状态
    changeStateById(id,state){
        return request({
            url: `/${group_name}/${api_name}/${id}/${state}`,
            method: 'put'
        })
    },

    changeById(form){
        return request({
            url: `/${group_name}/${api_name}`,
            method: 'put',
            data: form
        })
    },

    setHot(id){
        return request({
            url: `/${group_name}/${api_name}/hot/${id}`,
            method: 'put',
        })
    }
}
