import request from '@/router/axios';
export function setUsersAuthority(siteId, userIds, authority) {
    return request({
        url: '/manage/station/templateUserAuthority/setUsersAuthority',
        method: 'post',
        data: {siteId, userIds, authority}
    })
}
export function getUsersAuthority(siteId, userIds) {
    return request({
        url: '/manage/station/templateUserAuthority/getUsersAuthority',
        method: 'post',
        data: {siteId, userIds}
    });
}
