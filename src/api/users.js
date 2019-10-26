import request from '@/utils/request'
const group_name = 'user'
const api_name = 'user'
export default{
    addUser(form){
        return request(
            {
                url: `/${group_name}/${api_name}/addUser`,
                method: 'post',
                data: form
            }
        )
    },

    search(page, size, searchMap){
        return request({
            url: `/${group_name}/${api_name}/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    changeUser(form){
        return request({
            url: `/${group_name}/${api_name}/changeUser`,
            method: 'post',
            data: form
        })
    },

    deleteById(id){
        return request({
            url: `/${group_name}/${api_name}/${id}`,
            method: 'delete'
        })
    },
    // 恢复用户
    recoverById(id){
        return request({
            url: `/${group_name}/${api_name}/${id}`,
            method: 'put'
        })
    }
}