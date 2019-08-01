import request from '@/router/axios';
export function getMaterials(id) {
    return request({
        url: '/manage/item/materials/getByMaterials',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMaterials(materialsVo){
    const data = materialsVo;
    return request({
        url: '/manage/item/materials/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMaterials(id) {
    const data = {id};
    return request({
        url: '/manage/item/materials/removeByMaterials',
        method: 'post',
        data
    })
}
export function delMaterialss(ids) {
    const data = {ids};
    return request({
        url: '/manage/item/materials/removeByIds',
        method: 'post',
        data
    })
}
export function getMaterialsList(query) {
    return request({
        url: '/manage/item/materials/pageByMaterials',
        method: 'get',
        params: query
    });
}


