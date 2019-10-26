import request from '@/utils/request'
const group_name = 'setting'
const api_name = 'setting'
export default{
    init(){
        return request({
            url: `/${group_name}/${api_name}/init`,
            method: 'post',
        })
    },

    submit(autoAttention,autoNews){
        return request({
            url: `/${group_name}/${api_name}/changeSetting`,
            method: 'put',
            data: {autoAttention,autoNews}
        })
    },

    deletePictureByIds(data){
        return request({
            url: `/${group_name}/${api_name}/picture`,
            method: 'delete',
            data: data
        })
    },

    getPictureInfoById(){
        return request({
            url: `/${group_name}/${api_name}/picture`,
            method: 'get',
        })
    },

    getHotAttention(){
        return request({
            url: `/${group_name}/${api_name}/attention`,
            method: 'get',
        })
    },

    deleteAttentionByIds(data){
        return request({
            url: `/${group_name}/${api_name}/attention`,
            method: 'delete',
            data: data
        })
    },

    getHotNews(){
        return request({
            url: `/${group_name}/${api_name}/news`,
            method: 'get',
        })
    },

    deleteNewsByIds(data){
        return request({
            url: `/${group_name}/${api_name}/news`,
            method: 'delete',
            data: data
        })
    }
}