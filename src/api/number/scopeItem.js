import request from '@/router/axios';
export function getScopeItem(id) {
    return request({
        url: '/manage/number/scopeItem/getByScopeItem',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateScopeItem(scopeItemVo){
    const data = scopeItemVo;
    return request({
        url: '/manage/number/scopeItem/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delScopeItem(id) {
    const data = {id};
    return request({
        url: '/manage/number/scopeItem/removeByScopeItem',
        method: 'post',
        data
    })
}
export function delScopeItems(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/scopeItem/removeByIds',
        method: 'post',
        data
    })
}

export function getAllScopeItem(query) {
    return request({
        url: '/manage/number/scopeItem/listByScopeItem',
        method: 'get',
        params: query
    })
}
export function setScopeItems(scopeId, itemIds) {
    return request({
        url: '/manage/number/scopeItem/setScopeItems',
        method: 'post',
        data: {scopeId, itemIds}
    })
}
export function getItemList(query) {
    return request({
        url: '/manage/number/scopeItem/getScopeItemList',
        method: 'get',
        params: query
    })
}

