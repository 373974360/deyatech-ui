import request from '@/router/axios';
export function getCatalog(id) {
    return request({
        url: '/manage/station/catalog/getByCatalog',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCatalog(catalogVo){
    const data = catalogVo;
    return request({
        url: '/manage/station/catalog/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCatalog(id) {
    const data = {id};
    return request({
        url: '/manage/station/catalog/removeByCatalog',
        method: 'post',
        data
    })
}
export function delCatalogs(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/catalog/removeByIds',
        method: 'post',
        data
    })
}
export function getCatalogTree(query) {
    return request({
        url: '/manage/station/catalog/getTree',
        method: 'get',
        params: query
    });
}
export function getUserCatalogTree(query) {
    return request({
        url: '/manage/station/catalog/getUserCatalogTree',
        method: 'get',
        params: query
    });
}
export function getCatalogCascader(query) {
    return request({
        url: '/manage/station/catalog/getCascader',
        method: 'get',
        params: query
    });
}

export function existsName(query) {
    return request({
        url: '/manage/station/catalog/existsName',
        method: 'get',
        params: query
    })
}

export function existsAliasName(query) {
    return request({
        url: '/manage/station/catalog/existsAliasName',
        method: 'get',
        params: query
    })
}

export function existsEname(query) {
    return request({
        url: '/manage/station/catalog/existsEname',
        method: 'get',
        params: query
    })
}

export function hasTemplate(query) {
    return request({
        url: '/manage/station/catalog/hasTemplate',
        method: 'get',
        params: query
    })
}
