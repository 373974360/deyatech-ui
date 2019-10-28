import request from '@/router/axios';
export function getCatalogUser(id) {
    return request({
        url: '/manage/station/catalogUser/getByCatalogUser',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCatalogUser(catalogUserVo){
    const data = catalogUserVo;
    return request({
        url: '/manage/station/catalogUser/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCatalogUser(id) {
    const data = {id};
    return request({
        url: '/manage/station/catalogUser/removeByCatalogUser',
        method: 'post',
        data
    })
}
export function delCatalogUsers(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/catalogUser/removeByIds',
        method: 'post',
        data
    })
}
export function getCatalogUserList(query) {
    return request({
        url: '/manage/station/catalogUser/pageByCatalogUser',
        method: 'get',
        params: query
    });
}

export function getAllUserCatalogs(query) {
    return request({
        url: '/manage/station/catalogUser/listByCatalogUser',
        method: 'get',
        params: query
    })
}

export function setUserCatalogs(userId, catalogIds, siteId) {
    return request({
        url: '/manage/station/catalogUser/setUserCatalogs',
        method: 'post',
        data: {userId, catalogIds, siteId}
    })
}
