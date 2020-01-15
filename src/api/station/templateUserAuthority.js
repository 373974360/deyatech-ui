import request from '@/router/axios';
export function setUsersAuthority(userIds, authority) {
    return request({
        url: '/manage/station/templateUserAuthority/setUsersAuthority',
        method: 'post',
        data: {userIds, authority}
    })
}
export function getUsersAuthority(userIds) {
    return request({
        url: '/manage/station/templateUserAuthority/getUsersAuthority',
        method: 'post',
        data: {userIds}
    });
}
