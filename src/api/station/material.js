import request from '@/router/axios';
export function getMaterial(id) {
    return request({
        url: '/manage/station/material/getByMaterial',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMaterial(materialVo){
    const data = materialVo;
    return request({
        url: '/manage/station/material/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMaterial(id) {
    const data = {id};
    return request({
        url: '/manage/station/material/removeByMaterial',
        method: 'post',
        data
    })
}
export function delMaterials(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/material/removeByIds',
        method: 'post',
        data
    })
}
export function getMaterialList(query) {
    return request({
        url: '/manage/station/material/pageByMaterial',
        method: 'get',
        params: query
    });
}

export function getSiteUploadPath(params) {
    return request({
        url: '/manage/station/material/getSiteUploadPath',
        method: 'get',
        params: params
    });
}
