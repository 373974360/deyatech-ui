import request from '@/router/axios';
export function getResourceManagement(id) {
    return request({
        url: '/manage/station/resourceManagement/getByResourceManagement',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateResourceManagement(resourceManagementVo){
    const data = resourceManagementVo;
    return request({
        url: '/manage/station/resourceManagement/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delResourceManagement(id) {
    const data = {id};
    return request({
        url: '/manage/station/resourceManagement/removeByResourceManagement',
        method: 'post',
        data
    })
}
export function delResourceManagements(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/resourceManagement/removeByIds',
        method: 'post',
        data
    })
}
export function getResourceManagementList(query) {
    return request({
        url: '/manage/station/resourceManagement/pageByResourceManagement',
        method: 'get',
        params: query
    });
}


