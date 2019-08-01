import request from '@/router/axios';


export function getAccessToken(authType) {
    return request({
        url: '/manage/authenticate/result/getAccessToken',
        method: 'get',
        params: {authType}
    });
}

export function getCertToken(query) {
    return request({
        url: '/manage/authenticate/result/getCertToken',
        method: 'get',
        params: query
    });
}
export function getCertResult(query) {
    return request({
        url: '/manage/authenticate/result/getCertResult',
        method: 'get',
        params: query
    });
}
export function getAuthenticateResult(query) {
    return request({
        url: '/manage/authenticate/result/getAuthenticateResult',
        method: 'get',
        params: query
    });
}

export function getResult(id) {
    return request({
        url: '/manage/authenticate/result/getByResult',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateResult(resultVo){
    const data = resultVo;
    return request({
        url: '/manage/authenticate/result/saveOrUpdate',
        method: 'post',
        data
    })
}

export function delResult(id) {
    const data = {id};
    return request({
        url: '/manage/authenticate/result/removeByResult',
        method: 'post',
        data
    })
}
export function delResults(ids) {
    const data = {ids};
    return request({
        url: '/manage/authenticate/result/removeByIds',
        method: 'post',
        data
    })
}
export function getResultList(query) {
    return request({
        url: '/manage/authenticate/result/pageByResult',
        method: 'get',
        params: query
    });
}

export function  getCompanyName(companyName) {
    return request({
        url: '/manage/authenticate/result/getCompanyName',
        method: 'get',
        params: {companyName}
    })
}
export function  getAuthIdByCompanyName(companyName) {
    return request({
        url: '/manage/authenticate/result/getAuthIdByCompanyName',
        method: 'get',
        params: {companyName}
    })
}

