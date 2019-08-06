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
export function isNameExist(query) {
    return request({
        url: '/manage/resource/domain/isNameExist',
        method: 'get',
        params: query
    });
}
export function runOrStopDomainById(query) {
    return request({
        url: '/manage/resource/domain/runOrStopDomainById',
        method: 'get',
        params: query
    });
}
export function updateSignByIdAndStationGroupId(query) {
    return request({
        url: '/manage/resource/domain/updateSignByIdAndStationGroupId',
        method: 'get',
        params: query
    });
}

