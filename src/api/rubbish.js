import request from '@/utils/request'
const group_name = 'rubbish'
const api_name = 'rubbish'
export default{
    search(page, size, searchMap){
        return request({
            url: `/${group_name}/${api_name}/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    // 修改动态状态
    changeStateById(id,state){
        return request({
            url: `/${group_name}/${api_name}/${id}/${state}`,
            method: 'put'
        })
    },

    changeRubbish(data){
        return request({
            url: `/${group_name}/${api_name}`,
            method: 'put',
            data: data
        })
    }
}