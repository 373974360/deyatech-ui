import request from '@/router/axios';
export function getIdentity(id) {
    return request({
        url: '/manage/number/identity/getByIdentity',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateIdentity(identityVo){
    const data = identityVo;
    return request({
        url: '/manage/number/identity/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delIdentity(id) {
    const data = {id};
    return request({
        url: '/manage/number/identity/removeByIdentity',
        method: 'post',
        data
    })
}
export function delIdentitys(ids) {
    const data = {ids};
    return request({
        url: '/manage/number/identity/removeByIds',
        method: 'post',
        data
    })
}
export function getIdentityList(query) {
    return request({
        url: '/manage/number/identity/pageByIdentity',
        method: 'get',
        params: query
    });
}


