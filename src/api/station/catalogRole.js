import request from '@/router/axios';
export function getCatalogRole(id) {
    return request({
        url: '/manage/station/catalogRole/getByCatalogRole',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateCatalogRole(catalogRoleVo){
    const data = catalogRoleVo;
    return request({
        url: '/manage/station/catalogRole/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delCatalogRole(id) {
    const data = {id};
    return request({
        url: '/manage/station/catalogRole/removeByCatalogRole',
        method: 'post',
        data
    })
}
export function delCatalogRoles(ids) {
    const data = {ids};
    return request({
        url: '/manage/station/catalogRole/removeByIds',
        method: 'post',
        data
    })
}
export function getCatalogRoleList(query) {
    return request({
        url: '/manage/station/catalogRole/pageByCatalogRole',
        method: 'get',
        params: query
    });
}

export function getAllRoleCatalogs(query) {
    return request({
        url: '/manage/station/catalogRole/listByCatalogRole',
        method: 'get',
        params: query
    })
}

export function setRoleCatalogs(roleId, catalogIds, siteId) {
    return request({
        url: '/manage/station/catalogRole/setRoleCatalogs',
        method: 'post',
        data: {roleId, catalogIds, siteId}
    })
}
export function delCatalogRoleByRoleIds(roleIds) {
    const data = {roleIds};
    return request({
        url: '/manage/station/catalogRole/removeByRoleIds',
        method: 'post',
        data
    })
}
