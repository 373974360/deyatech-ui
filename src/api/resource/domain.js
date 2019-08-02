import request from '@/router/axios';
export function getDomain(id) {
    return request({
        url: '/manage/resource/domain/getByDomain',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDomain(domainVo){
    const data = domainVo;
    return request({
        url: '/manage/resource/domain/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delDomain(id) {
    const data = {id};
    return request({
        url: '/manage/resource/domain/removeByDomain',
        method: 'post',
        data
    })
}
export function delDomains(ids) {
    const data = {ids};
    return request({
        url: '/manage/resource/domain/removeByIds',
        method: 'post',
        data
    })
}
export function getDomainList(query) {
    return request({
        url: '/manage/resource/domain/pageByDomain',
        method: 'get',
        params: query
    });
}


