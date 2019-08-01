import request from '@/router/axios';
export function getPreauditMaterials(id) {
    return request({
        url: '/manage/preaudit/preauditMaterials/getByPreauditMaterials',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdatePreauditMaterials(preauditMaterialsVo){
    const data = preauditMaterialsVo;
    return request({
        url: '/manage/preaudit/preauditMaterials/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delPreauditMaterials(id) {
    const data = {id};
    return request({
        url: '/manage/preaudit/preauditMaterials/removeByPreauditMaterials',
        method: 'post',
        data
    })
}
export function delPreauditMaterialss(ids) {
    const data = {ids};
    return request({
        url: '/manage/preaudit/preauditMaterials/removeByIds',
        method: 'post',
        data
    })
}
export function getPreauditMaterialsList(query) {
    return request({
        url: '/manage/preaudit/preauditMaterials/pageByPreauditMaterials',
        method: 'get',
        params: query
    });
}

export function getAllPreauditMaterials(query) {
    return request({
        url: '/manage/preaudit/preauditMaterials/listByPreauditMaterials',
        method: 'get',
        params: query
    });
}

