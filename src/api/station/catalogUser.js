import request from '@/router/axios';
export function setUsersCatalogs(userIds, catalogIds) {
    return request({
        url: '/manage/station/catalogUser/setUsersCatalogs',
        method: 'post',
        data: {userIds, catalogIds}
    })
}
export function getUsersCatalogs(userIds) {
    return request({
        url: '/manage/station/catalogUser/getUsersCatalogs',
        method: 'post',
        data: {userIds}
    })
}
