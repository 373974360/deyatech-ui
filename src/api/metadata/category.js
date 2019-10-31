import request from '@/router/axios';

export function getMetadataCategory(id) {
    return request({
        url: '/manage/admin/metadataCategory/getByMetadataCategory',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateMetadataCategory(metadataCategoryVo){
    const data = metadataCategoryVo;
    return request({
        url: '/manage/admin/metadataCategory/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delMetadataCategory(id) {
    const data = {id};
    return request({
        url: '/manage/admin/metadataCategory/removeByMetadataCategory',
        method: 'post',
        data
    })
}
export function delMetadataCategorys(ids) {
    const data = {ids};
    return request({
        url: '/manage/admin/metadataCategory/removeByIds',
        method: 'post',
        data
    })
}
export function getMetadataCategoryTree(query) {
    return request({
        url: '/manage/admin/metadataCategory/getTree',
        method: 'get',
        params: query
    });
}

export function getMetadataCategoryCascader(query) {
    return request({
        url: '/manage/admin/metadataCategory/getCascader',
        method: 'get',
        params: query
    });
}

export function checkMetadataExist(id) {
    return request({
        url: '/manage/admin/metadataCategory/checkMetadataExist',
        method: 'get',
        params: {id}
    })
}

export function getNextSortNo() {
    return request({
        url: '/manage/admin/metadataCategory/getNextSortNo',
        method: 'get',
        params: {}
    });
}
