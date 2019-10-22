import request from '@/router/axios';

export function getUserInfo() {
    return request({
        url: '/manage/evaluate/sso/getUserProfile',
        method: 'get'
    })
}
