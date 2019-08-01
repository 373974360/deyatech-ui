import request from '@/router/axios';
export function getHandlingMaterials(id) {
    return request({
        url: '/manage/handling/handlingMaterials/getByHandlingMaterials',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateHandlingMaterials(handlingMaterialsVo){
    const data = handlingMaterialsVo;
    return request({
        url: '/manage/handling/handlingMaterials/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delHandlingMaterials(id) {
    const data = {id};
    return request({
        url: '/manage/handling/handlingMaterials/removeByHandlingMaterials',
        method: 'post',
        data
    })
}
export function delHandlingMaterialss(ids) {
    const data = {ids};
    return request({
        url: '/manage/handling/handlingMaterials/removeByIds',
        method: 'post',
        data
    })
}
export function getHandlingMaterialsList(query) {
    return request({
        url: '/manage/handling/handlingMaterials/pageByHandlingMaterials',
        method: 'get',
        params: query
    });
}


