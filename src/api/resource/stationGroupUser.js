import request from '@/router/axios';

export function getStationGroupUser(stationGroupId, departmentId) {
    return request({
        url: '/manage/resource/stationGroupUser/getStationGroupUser',
        method: 'get',
        params: {stationGroupId, departmentId}
    })
}
export function setStationGroupUsers(stationGroupId, userIds){
    return request({
        url: '/manage/resource/stationGroupUser/setStationGroupUsers',
        method: 'post',
        data: {stationGroupId, userIds}
    })
}
export function pageStationGroupUser(query) {
    return request({
        url: '/manage/resource/stationGroupUser/pageStationGroupUser',
        method: 'get',
        params: query
    })
}
export function pageStationAssociationUser(query) {
    return request({
        url: '/manage/resource/stationGroupUser/pageStationAssociationUser',
        method: 'get',
        params: query
    })
}
