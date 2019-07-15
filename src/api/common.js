import request from '@/router/axios';

export function loginByUsername(userInfo) {
    return request({
        url: '/manage/auth/userJwt/token',
        method: 'get',
        params: userInfo
    });
}

export function refreshToken() {
    return request({
        url: '/manage/auth/userJwt/refresh',
        method: 'get'
    });
}

export function logout() {
    return request({
        url: '/manage/auth/userJwt/invalid',
        method: 'get'
    });
}

export function validateVerifyCode(verifyCode, random) {
    return request({
        url: '/manage/common/validateVerifyCode',
        method: 'get',
        params: {verifyCode, random}
    });
}

export function getEnums() {
    return request({
        url: '/manage/common/getEnums',
        method: 'get'
    });
}

export function getDicts() {
    return request({
        url: '/manage/common/getDictionaries',
        method: 'get'
    });
}

export const getButtons = () => request({
    url: '/api/blade-system/menu/buttons',
    method: 'get'
});

export const getMenu = () => request({
    url: '/api/blade-system/menu/routes',
    method: 'get'
});

export const sendLogs = (list) => request({
    url: '/user/logout',
    method: 'post',
    data: list
})
