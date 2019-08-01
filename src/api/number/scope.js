import request from '@/router/axios';
export function getScope(id) {
    return request({
        url: '/manage/number/scope/getByScope',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateScope(scopeVo){
    const data = scopeVo;
    return request({
        url: '/manage/number/scope/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delScope(id) {
    const data = {id};
    return request({
        url: '/manage/number/scope/removeByScope',
        method: 'post',
        data
    })
}
export function delScopes(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/scope/removeByIds',
        method: 'post',
        data
    })
}
export function getScopeList(query) {
    return request({
        url: '/manage/number/scope/pageByScope',
        method: 'get',
        params: query
    });
}



