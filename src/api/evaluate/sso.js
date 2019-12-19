import request from '@/router/axios';

export function getUserInfo() {
    return request({
        url: '/manage/evaluate/sso/getUserProfile',
        method: 'get'
    })
}

export function getOrgDetail(orgId) {
    return request({
        url: '/manage/evaluate/sso/getOrgDetail',
        method: 'get',
        params: {orgId}
    })
}
